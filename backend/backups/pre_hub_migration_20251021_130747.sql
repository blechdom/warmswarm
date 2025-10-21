--
-- PostgreSQL database dump
--

-- Dumped from database version 15.13
-- Dumped by pg_dump version 15.13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: activity_action; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.activity_action AS ENUM (
    'member_joined',
    'member_left',
    'role_assigned',
    'role_removed',
    'content_created',
    'content_sent',
    'content_received',
    'event_scheduled',
    'event_sent',
    'permission_changed'
);


ALTER TYPE public.activity_action OWNER TO postgres;

--
-- Name: content_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.content_type AS ENUM (
    'audio',
    'image',
    'text',
    'preset',
    'timer',
    'instruction'
);


ALTER TYPE public.content_type OWNER TO postgres;

--
-- Name: event_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.event_status AS ENUM (
    'pending',
    'sent',
    'cancelled',
    'failed'
);


ALTER TYPE public.event_status OWNER TO postgres;

--
-- Name: message_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.message_type AS ENUM (
    'text',
    'audio',
    'image',
    'preset',
    'system'
);


ALTER TYPE public.message_type OWNER TO postgres;

--
-- Name: assign_member_to_role(uuid, uuid, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.assign_member_to_role(p_member_id uuid, p_role_id uuid, p_assigned_by uuid DEFAULT NULL::uuid) RETURNS uuid
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_assignment_id UUID;
BEGIN
    INSERT INTO swarm_member_roles (member_id, role_id, assigned_by)
    VALUES (p_member_id, p_role_id, p_assigned_by)
    ON CONFLICT (member_id, role_id) DO NOTHING
    RETURNING id INTO v_assignment_id;
    
    -- Log the assignment
    INSERT INTO swarm_activity_log (swarm_id, member_id, action, target_member_id, role_id)
    SELECT 
        sm.swarm_id,
        p_assigned_by,
        'role_assigned'::activity_action,
        p_member_id,
        p_role_id
    FROM swarm_members sm
    WHERE sm.id = p_member_id;
    
    RETURN v_assignment_id;
END;
$$;


ALTER FUNCTION public.assign_member_to_role(p_member_id uuid, p_role_id uuid, p_assigned_by uuid) OWNER TO postgres;

--
-- Name: create_default_swarm_roles(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_default_swarm_roles(p_swarm_id uuid) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Conductor role
    INSERT INTO swarm_roles (swarm_id, name, description,
        can_send_audio, can_receive_audio,
        can_send_text, can_receive_text,
        can_send_images, can_receive_images,
        can_view_members, can_view_activity_log,
        can_schedule_content, can_manage_roles,
        color, icon)
    VALUES (
        p_swarm_id, 'Conductor',
        'Full control over performance',
        true, true, true, true, true, true, true, true, true, true,
        '#FF6B6B', 'conductor'
    );
    
    -- Performer role
    INSERT INTO swarm_roles (swarm_id, name, description,
        can_send_audio, can_receive_audio,
        can_send_text, can_receive_text,
        can_send_images, can_receive_images,
        can_view_members,
        color, icon)
    VALUES (
        p_swarm_id, 'Performer',
        'Receives instructions and audio cues',
        false, true, false, true, false, true, true,
        '#667EEA', 'user'
    );
    
    -- Lead role
    INSERT INTO swarm_roles (swarm_id, name, description,
        can_send_audio, can_receive_audio,
        can_send_text, can_receive_text,
        can_view_members, can_view_activity_log,
        color, icon)
    VALUES (
        p_swarm_id, 'Lead',
        'Lead performer with communication ability',
        true, true, true, true, true, true,
        '#2ECC71', 'star'
    );
END;
$$;


ALTER FUNCTION public.create_default_swarm_roles(p_swarm_id uuid) OWNER TO postgres;

--
-- Name: get_member_roles(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_member_roles(p_member_id uuid) RETURNS TABLE(role_id uuid, role_name character varying, assigned_at timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sr.id,
        sr.name,
        smr.assigned_at
    FROM swarm_member_roles smr
    JOIN swarm_roles sr ON smr.role_id = sr.id
    WHERE smr.member_id = p_member_id
    ORDER BY smr.assigned_at DESC;
END;
$$;


ALTER FUNCTION public.get_member_roles(p_member_id uuid) OWNER TO postgres;

--
-- Name: get_members_by_role(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_members_by_role(p_role_id uuid) RETURNS TABLE(member_id uuid, nickname character varying, joined_at timestamp without time zone)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sm.id,
        sm.nickname,
        sm.joined_at
    FROM swarm_member_roles smr
    JOIN swarm_members sm ON smr.member_id = sm.id
    WHERE smr.role_id = p_role_id
    ORDER BY sm.joined_at DESC;
END;
$$;


ALTER FUNCTION public.get_members_by_role(p_role_id uuid) OWNER TO postgres;

--
-- Name: member_can_send_audio(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.member_can_send_audio(p_member_id uuid) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM swarm_member_permissions
        WHERE member_id = p_member_id
        AND can_send_audio = true
    );
END;
$$;


ALTER FUNCTION public.member_can_send_audio(p_member_id uuid) OWNER TO postgres;

--
-- Name: member_can_send_text(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.member_can_send_text(p_member_id uuid) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM swarm_member_permissions
        WHERE member_id = p_member_id
        AND can_send_text = true
    );
END;
$$;


ALTER FUNCTION public.member_can_send_text(p_member_id uuid) OWNER TO postgres;

--
-- Name: trigger_create_default_roles(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.trigger_create_default_roles() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Automatically create default roles for new swarm
    PERFORM create_default_swarm_roles(NEW.id);
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.trigger_create_default_roles() OWNER TO postgres;

--
-- Name: trigger_log_role_assignment(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.trigger_log_role_assignment() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO swarm_activity_log (swarm_id, member_id, action, target_member_id, role_id)
        SELECT 
            sm.swarm_id,
            NEW.assigned_by,
            'role_assigned'::activity_action,
            NEW.member_id,
            NEW.role_id
        FROM swarm_members sm
        WHERE sm.id = NEW.member_id;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO swarm_activity_log (swarm_id, member_id, action, target_member_id, role_id)
        SELECT 
            sm.swarm_id,
            NULL,
            'role_removed'::activity_action,
            OLD.member_id,
            OLD.role_id
        FROM swarm_members sm
        WHERE sm.id = OLD.member_id;
    END IF;
    
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.trigger_log_role_assignment() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: swarm_activity_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.swarm_activity_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    swarm_id uuid NOT NULL,
    member_id uuid,
    action public.activity_action NOT NULL,
    target_member_id uuid,
    role_id uuid,
    content_id uuid,
    metadata jsonb,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.swarm_activity_log OWNER TO postgres;

--
-- Name: swarm_content; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.swarm_content (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    swarm_id uuid NOT NULL,
    type public.content_type NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    created_by uuid,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    deleted_at timestamp without time zone
);


ALTER TABLE public.swarm_content OWNER TO postgres;

--
-- Name: swarm_content_audio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.swarm_content_audio (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    content_id uuid NOT NULL,
    source_type character varying(20),
    url text,
    file_path text,
    duration_ms integer,
    format character varying(10),
    bitrate integer,
    file_size_bytes bigint,
    tts_text text,
    tts_language character varying(10),
    tts_voice character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT swarm_content_audio_source_type_check CHECK (((source_type)::text = ANY ((ARRAY['url'::character varying, 'upload'::character varying, 'tts'::character varying, 'generated'::character varying])::text[])))
);


ALTER TABLE public.swarm_content_audio OWNER TO postgres;

--
-- Name: swarm_content_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.swarm_content_images (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    content_id uuid NOT NULL,
    source_type character varying(20),
    url text,
    file_path text,
    width integer,
    height integer,
    format character varying(10),
    file_size_bytes bigint,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT swarm_content_images_source_type_check CHECK (((source_type)::text = ANY ((ARRAY['url'::character varying, 'upload'::character varying])::text[])))
);


ALTER TABLE public.swarm_content_images OWNER TO postgres;

--
-- Name: swarm_content_text; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.swarm_content_text (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    content_id uuid NOT NULL,
    text_content text NOT NULL,
    font_family character varying(100),
    font_size integer,
    font_color character varying(7),
    background_color character varying(7),
    text_align character varying(20),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.swarm_content_text OWNER TO postgres;

--
-- Name: swarm_content_full; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.swarm_content_full AS
 SELECT c.id,
    c.swarm_id,
    c.type,
    c.name,
    c.description,
    c.created_at,
        CASE
            WHEN (c.type = 'audio'::public.content_type) THEN jsonb_build_object('url', ca.url, 'duration_ms', ca.duration_ms, 'format', ca.format)
            WHEN (c.type = 'image'::public.content_type) THEN jsonb_build_object('url', ci.url, 'width', ci.width, 'height', ci.height)
            WHEN (c.type = 'text'::public.content_type) THEN jsonb_build_object('text', ct.text_content, 'font_color', ct.font_color)
            ELSE NULL::jsonb
        END AS metadata
   FROM (((public.swarm_content c
     LEFT JOIN public.swarm_content_audio ca ON ((c.id = ca.content_id)))
     LEFT JOIN public.swarm_content_images ci ON ((c.id = ci.content_id)))
     LEFT JOIN public.swarm_content_text ct ON ((c.id = ct.content_id)));


ALTER TABLE public.swarm_content_full OWNER TO postgres;

--
-- Name: swarm_content_timers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.swarm_content_timers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    content_id uuid NOT NULL,
    duration_ms integer NOT NULL,
    label character varying(100),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.swarm_content_timers OWNER TO postgres;

--
-- Name: swarm_member_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.swarm_member_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    member_id uuid NOT NULL,
    role_id uuid NOT NULL,
    assigned_at timestamp without time zone DEFAULT now(),
    assigned_by uuid
);


ALTER TABLE public.swarm_member_roles OWNER TO postgres;

--
-- Name: swarm_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.swarm_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    swarm_id uuid NOT NULL,
    nickname character varying(255) NOT NULL,
    joined_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    is_creator boolean DEFAULT false
);


ALTER TABLE public.swarm_members OWNER TO postgres;

--
-- Name: swarm_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.swarm_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    swarm_id uuid NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    can_send_audio boolean DEFAULT false,
    can_receive_audio boolean DEFAULT true,
    can_send_text boolean DEFAULT false,
    can_receive_text boolean DEFAULT true,
    can_send_images boolean DEFAULT false,
    can_receive_images boolean DEFAULT true,
    can_view_members boolean DEFAULT true,
    can_view_activity_log boolean DEFAULT false,
    can_schedule_content boolean DEFAULT false,
    can_manage_roles boolean DEFAULT false,
    show_menu boolean DEFAULT true,
    show_title boolean DEFAULT true,
    color character varying(7),
    icon character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.swarm_roles OWNER TO postgres;

--
-- Name: swarm_member_permissions; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.swarm_member_permissions AS
 SELECT sm.id AS member_id,
    sm.swarm_id,
    sm.nickname,
    bool_or(sr.can_send_audio) AS can_send_audio,
    bool_or(sr.can_receive_audio) AS can_receive_audio,
    bool_or(sr.can_send_text) AS can_send_text,
    bool_or(sr.can_receive_text) AS can_receive_text,
    bool_or(sr.can_send_images) AS can_send_images,
    bool_or(sr.can_receive_images) AS can_receive_images,
    bool_or(sr.can_view_members) AS can_view_members,
    bool_or(sr.can_view_activity_log) AS can_view_activity_log,
    bool_or(sr.can_schedule_content) AS can_schedule_content,
    bool_or(sr.can_manage_roles) AS can_manage_roles
   FROM ((public.swarm_members sm
     LEFT JOIN public.swarm_member_roles smr ON ((sm.id = smr.member_id)))
     LEFT JOIN public.swarm_roles sr ON ((smr.role_id = sr.id)))
  GROUP BY sm.id, sm.swarm_id, sm.nickname;


ALTER TABLE public.swarm_member_permissions OWNER TO postgres;

--
-- Name: swarm_message_targets_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.swarm_message_targets_members (
    message_id uuid NOT NULL,
    member_id uuid NOT NULL
);


ALTER TABLE public.swarm_message_targets_members OWNER TO postgres;

--
-- Name: swarm_message_targets_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.swarm_message_targets_roles (
    message_id uuid NOT NULL,
    role_id uuid NOT NULL
);


ALTER TABLE public.swarm_message_targets_roles OWNER TO postgres;

--
-- Name: swarm_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.swarm_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    swarm_id uuid NOT NULL,
    sender_id uuid,
    type public.message_type NOT NULL,
    content_id uuid,
    text_content text,
    target_all boolean DEFAULT false,
    sent_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.swarm_messages OWNER TO postgres;

--
-- Name: swarm_preset_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.swarm_preset_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    preset_id uuid NOT NULL,
    content_id uuid NOT NULL,
    sequence_order integer NOT NULL,
    delay_ms integer DEFAULT 0
);


ALTER TABLE public.swarm_preset_items OWNER TO postgres;

--
-- Name: swarm_presets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.swarm_presets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    swarm_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    created_by uuid,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.swarm_presets OWNER TO postgres;

--
-- Name: swarm_scheduled_event_targets_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.swarm_scheduled_event_targets_members (
    event_id uuid NOT NULL,
    member_id uuid NOT NULL
);


ALTER TABLE public.swarm_scheduled_event_targets_members OWNER TO postgres;

--
-- Name: swarm_scheduled_event_targets_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.swarm_scheduled_event_targets_roles (
    event_id uuid NOT NULL,
    role_id uuid NOT NULL
);


ALTER TABLE public.swarm_scheduled_event_targets_roles OWNER TO postgres;

--
-- Name: swarm_scheduled_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.swarm_scheduled_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    swarm_id uuid NOT NULL,
    content_id uuid NOT NULL,
    scheduled_time timestamp without time zone NOT NULL,
    status public.event_status DEFAULT 'pending'::public.event_status,
    target_all boolean DEFAULT false,
    created_by uuid,
    created_at timestamp without time zone DEFAULT now(),
    sent_at timestamp without time zone
);


ALTER TABLE public.swarm_scheduled_events OWNER TO postgres;

--
-- Name: swarms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.swarms (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    description text NOT NULL,
    privacy character varying(50) NOT NULL,
    category character varying(100) NOT NULL,
    invite_code character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT swarms_privacy_check CHECK (((privacy)::text = ANY ((ARRAY['public'::character varying, 'private'::character varying, 'hidden'::character varying])::text[])))
);


ALTER TABLE public.swarms OWNER TO postgres;

--
-- Data for Name: swarm_activity_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.swarm_activity_log (id, swarm_id, member_id, action, target_member_id, role_id, content_id, metadata, created_at) FROM stdin;
\.


--
-- Data for Name: swarm_content; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.swarm_content (id, swarm_id, type, name, description, created_by, created_at, updated_at, deleted_at) FROM stdin;
fc156964-7763-4819-a0c4-29c30b78a1d9	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	animated score	\N	\N	2025-10-20 22:06:15.6073	2025-10-20 22:06:15.6073	\N
502d43bd-2dea-44de-8fcb-a1ee5e26e875	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	cardew treatise	\N	\N	2025-10-20 22:06:15.614967	2025-10-20 22:06:15.614967	\N
ca801f52-aa65-4cf0-915c-b6cee643ea1c	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	dance animation	\N	\N	2025-10-20 22:06:15.620402	2025-10-20 22:06:15.620402	\N
75f93aec-12fa-471f-b644-7dd4340eaf0e	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	countdown	\N	\N	2025-10-20 22:06:15.625874	2025-10-20 22:06:15.625874	\N
a3967c17-acf3-4dd7-a2ee-5cb1159b9cf1	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	fame	Web-based images allow graphic internet content to be available during a performance. To save a web-based image, find a valid URL linking directly to online image content. A valid image URL with end with '.jpg' or '.png', and should not be a link to an html page containing the image. The easiest way to obtain a valid image URL is to right-click on the desired image in order to open the image in a new tab or window.	\N	2025-10-20 22:06:15.631423	2025-10-20 22:06:15.631423	\N
e2d32f12-2abf-4ca9-b6de-8892a3aa784d	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	Name your image here.	Web-based images allow graphic internet content to be available during a performance. To save a web-based image, find a valid URL linking directly to online image content. A valid image URL with end with '.jpg' or '.png', and should not be a link to an html page containing the image. The easiest way to obtain a valid image URL is to right-click on the desired image in order to open the image in a new tab or window.	\N	2025-10-20 22:06:15.636024	2025-10-20 22:06:15.636024	\N
d296fdda-05da-4291-97fb-c32b04f06496	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	Uploaded Image	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.641169	2025-10-20 22:06:15.641169	\N
6ac07f8b-4827-4e17-837c-90d312c3a930	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	arrows	\N	\N	2025-10-20 22:06:15.645998	2025-10-20 22:06:15.645998	\N
70578489-092a-4d96-a75c-87ac95ce8f13	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	metronome	\N	\N	2025-10-20 22:06:15.651254	2025-10-20 22:06:15.651254	\N
03b2a8d4-088d-4685-8324-3e7a5c192ba3	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	traditional notation	\N	\N	2025-10-20 22:06:15.656325	2025-10-20 22:06:15.656325	\N
cbe08b8e-69f2-49c4-affb-ae63a793fa9d	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	Chemical	\N	\N	2025-10-20 22:06:15.661474	2025-10-20 22:06:15.661474	\N
4e53ffca-cd17-4d1f-9c86-da2bafb3bd28	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	Record	\N	\N	2025-10-20 22:06:15.667261	2025-10-20 22:06:15.667261	\N
40754386-a009-4cea-8773-6d7210dc30b8	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	Repeat	\N	\N	2025-10-20 22:06:15.672397	2025-10-20 22:06:15.672397	\N
9911d47c-a874-49e7-850b-aff1f69269d2	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	Tango	\N	\N	2025-10-20 22:06:15.677234	2025-10-20 22:06:15.677234	\N
a5c143f5-f16c-47f5-8676-db456d1b5dac	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	conductor	\N	\N	2025-10-20 22:06:15.68318	2025-10-20 22:06:15.68318	\N
242c1bf8-47c8-40f6-b8fa-aaeb77058627	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	Chaos	\N	\N	2025-10-20 22:06:15.688114	2025-10-20 22:06:15.688114	\N
3c73b04d-2121-4ca8-835f-a55dd527e3aa	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	A Major	\N	\N	2025-10-20 22:06:15.692875	2025-10-20 22:06:15.692875	\N
de8187c5-03d5-40a5-a825-5d63a6ce2bbb	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	A3	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.698046	2025-10-20 22:06:15.698046	\N
c72a73fe-0982-4625-a716-eb46db7fb792	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	Bb3	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.703287	2025-10-20 22:06:15.703287	\N
4b3c4e0a-4899-4dc5-8a28-e5565f969796	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	B3	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.708995	2025-10-20 22:06:15.708995	\N
1b02ea8a-ef32-428e-9ac9-6d2c85d046f0	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	C4	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.713673	2025-10-20 22:06:15.713673	\N
f5fe7dfe-1adf-4cf7-8a13-8bd21b4a4382	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	Csharp4	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.71819	2025-10-20 22:06:15.71819	\N
8eee36e7-1afc-43fd-832f-c5901715b483	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	D4	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.723039	2025-10-20 22:06:15.723039	\N
0e4f3c5e-dbc7-4c7e-9c2d-218283c4c19d	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	Eflat4	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.728101	2025-10-20 22:06:15.728101	\N
420230bb-44ef-42d2-8090-41966bde9d98	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	E4	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.733249	2025-10-20 22:06:15.733249	\N
4cb4fe7d-1683-48b5-b9e6-314f1540768a	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	F4	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.738581	2025-10-20 22:06:15.738581	\N
e6e7cb1d-ecec-4c42-bdb4-a35fb306ba3f	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	Fsharp4	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.743477	2025-10-20 22:06:15.743477	\N
2ba7000e-52fd-4752-bb0c-127b20b158b7	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	G4	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.748531	2025-10-20 22:06:15.748531	\N
81f97481-8b5b-4df7-a296-9085bde2eeb4	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	Gsharp4	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.753717	2025-10-20 22:06:15.753717	\N
eee527fc-b888-4c85-8987-26efdfff042f	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	A4	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.758932	2025-10-20 22:06:15.758932	\N
321db19a-5d44-4613-a696-86798f5e8191	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	Bflat4	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.764176	2025-10-20 22:06:15.764176	\N
4aba2c4a-8e0d-4701-9a05-8d056445cf72	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	B4	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.769307	2025-10-20 22:06:15.769307	\N
2fd9e298-5fb4-4657-86b0-f26ad0c3269b	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Swing your partner to the left	\N	\N	2025-10-20 22:06:16.141177	2025-10-20 22:06:16.141177	\N
fa801f1f-cbce-4319-bef0-94cfa71801d5	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	C5	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.773681	2025-10-20 22:06:15.773681	\N
18e32bf0-5d70-4701-9e33-b12448fa431f	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	Csharp5	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.779186	2025-10-20 22:06:15.779186	\N
9c26972f-6c4c-4197-be41-b9997991ebea	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	D5	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.784268	2025-10-20 22:06:15.784268	\N
4805907d-f12a-434d-925b-561795b46524	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	Eflat5	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.788817	2025-10-20 22:06:15.788817	\N
eecb7929-252c-4426-8e74-d2c14b97737f	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	E5	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.793751	2025-10-20 22:06:15.793751	\N
7f13835e-94a2-49f2-88d2-5be9d775dd6e	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	uturn	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.798593	2025-10-20 22:06:15.798593	\N
7db6c81d-c624-4ef9-b01b-0ff03fbd2dc3	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	no bikes	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.803075	2025-10-20 22:06:15.803075	\N
3d3fc5ae-3863-497f-84d1-56a21ef61734	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	yield ahead	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.808197	2025-10-20 22:06:15.808197	\N
445fb098-61d0-48f4-b6eb-c3f932dec1f8	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	jog right	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.813264	2025-10-20 22:06:15.813264	\N
924665ff-f467-438d-b993-41a61abbd574	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	passing	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.820102	2025-10-20 22:06:15.820102	\N
a0eded8c-af70-47ef-bb6e-8228a6d5687d	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	curves ahead	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.825872	2025-10-20 22:06:15.825872	\N
89c3fedf-114a-4eca-939a-68fd974aedc5	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	stop sign	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.830963	2025-10-20 22:06:15.830963	\N
cf15380e-781d-4b0d-b96a-ef77a32b0425	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	no parking	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.8365	2025-10-20 22:06:15.8365	\N
7080aa9d-e1e9-41ea-b020-6832436296aa	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	no right turn	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.841394	2025-10-20 22:06:15.841394	\N
473ed2d0-039f-4860-b5aa-7a73d033ae09	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	no u-turn	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.849274	2025-10-20 22:06:15.849274	\N
6dd15d1f-fb5f-4d70-b76c-d6f2a52c6518	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	no left turn	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.857437	2025-10-20 22:06:15.857437	\N
6b1013d2-f985-49cb-89fa-3cd90a9374f6	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	no people	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.862102	2025-10-20 22:06:15.862102	\N
fde7448b-5156-4e5c-a0d7-63e0e3fc972f	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	wrong way	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.867648	2025-10-20 22:06:15.867648	\N
8c142268-3589-404f-a90d-f2caaeb0c78c	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	speed limit 50	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.872575	2025-10-20 22:06:15.872575	\N
f0e9a4ce-0a29-4650-8df0-a5acd7af652a	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	bump sign	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.877827	2025-10-20 22:06:15.877827	\N
982f1df6-006b-4df5-a886-17401399afe5	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	deer sign	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.882936	2025-10-20 22:06:15.882936	\N
a04ba9f8-705c-40b3-bd80-ed2d0e340962	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	come together	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.888112	2025-10-20 22:06:15.888112	\N
e06ad079-856e-49af-ad1f-293edb02fd20	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	split ahead	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.893078	2025-10-20 22:06:15.893078	\N
33ae332f-7440-4742-888b-17380de89583	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	When you hear this sound	\N	\N	2025-10-20 22:06:16.146441	2025-10-20 22:06:16.146441	\N
0de75c0e-0423-456b-89c9-5b71bfee4cdd	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	road closed	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.898511	2025-10-20 22:06:15.898511	\N
bde2fd37-31e7-4afe-b191-033397bf8369	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	intersection	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.903507	2025-10-20 22:06:15.903507	\N
7743f81e-2279-408a-96e4-c23d2ab5f1d1	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	detour	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.908559	2025-10-20 22:06:15.908559	\N
d896b55e-e9c9-4a88-8079-8a805cb13c4e	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	carpool	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.913438	2025-10-20 22:06:15.913438	\N
c12fbd5c-db88-4627-be70-deed30473d19	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	keep right	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.918676	2025-10-20 22:06:15.918676	\N
0084fa37-0939-497e-8cdc-f35cd0297013	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	stay right	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.923324	2025-10-20 22:06:15.923324	\N
71582997-fb70-4346-9503-cbb22063aef1	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	no right turn	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.928259	2025-10-20 22:06:15.928259	\N
225b8f9a-8c98-47b8-9a4d-c40fef147d2d	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	pass with care	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.933421	2025-10-20 22:06:15.933421	\N
ce67340c-c386-4df7-89ec-270981505438	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	reduce speed	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.938459	2025-10-20 22:06:15.938459	\N
2f49f368-b0aa-4811-9c19-9683edeb7804	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	do not enter	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.942918	2025-10-20 22:06:15.942918	\N
18ce2b4e-2749-42ae-9330-b09c0424cc94	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	no left turn	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.948293	2025-10-20 22:06:15.948293	\N
e6af9a90-cc3d-4656-aa36-18a0b7071a7a	4cd33b1b-898b-477d-bb01-23bc7a81b41f	image	one way	Image Uploads allow content uploaded from a computer or mobile device to be available during a performance. The upload functionality is currently suspended. In the meantime, email the image to Telebrain and the image will be uploaded manually.	\N	2025-10-20 22:06:15.953276	2025-10-20 22:06:15.953276	\N
4810fa96-5ce9-4f1e-929f-7e5fbde24a33	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Dog Growling	\N	\N	2025-10-20 22:06:15.959125	2025-10-20 22:06:15.959125	\N
548c2a15-9143-4f20-9b1c-d71bbf548645	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Uh oh Trombone	\N	\N	2025-10-20 22:06:15.965126	2025-10-20 22:06:15.965126	\N
d1126a92-5bce-4c96-be0c-5d9b69e209c7	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Man Falling	\N	\N	2025-10-20 22:06:15.970231	2025-10-20 22:06:15.970231	\N
bcd83cdd-323f-4a34-9a6f-5edfc9abf319	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	laugh	\N	\N	2025-10-20 22:06:15.975308	2025-10-20 22:06:15.975308	\N
5df3b4a8-f0b8-4456-bc12-89623d4ddc19	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	slide	\N	\N	2025-10-20 22:06:15.980125	2025-10-20 22:06:15.980125	\N
a52f103a-ca49-4de4-b021-afdc5991ee46	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	spring	\N	\N	2025-10-20 22:06:15.985256	2025-10-20 22:06:15.985256	\N
ce30b3ea-8af4-46e0-90c0-e106f30c526a	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Beep	\N	\N	2025-10-20 22:06:15.990426	2025-10-20 22:06:15.990426	\N
edb6ff58-7b5a-4925-9481-1c503f36def7	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Double Beep	\N	\N	2025-10-20 22:06:15.995224	2025-10-20 22:06:15.995224	\N
d38c497e-a380-483e-ab28-e8221d51c60f	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Ictus	\N	\N	2025-10-20 22:06:16.000008	2025-10-20 22:06:16.000008	\N
d927c2f8-4431-4cb3-a206-42c223b79d2b	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Zuction	\N	\N	2025-10-20 22:06:16.004883	2025-10-20 22:06:16.004883	\N
038a91ba-b45b-4dba-b4de-c158c7f77ea3	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	slidey up	\N	\N	2025-10-20 22:06:16.009657	2025-10-20 22:06:16.009657	\N
dce6ad1b-446f-49da-b7a8-eda2312cc44d	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	slidey down	\N	\N	2025-10-20 22:06:16.014663	2025-10-20 22:06:16.014663	\N
2262de67-300a-44fb-922e-876887e1c30d	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	noise hit	\N	\N	2025-10-20 22:06:16.019294	2025-10-20 22:06:16.019294	\N
6f0007e3-a1a3-410d-b174-bb81b3b32b47	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	chunkly	\N	\N	2025-10-20 22:06:16.023878	2025-10-20 22:06:16.023878	\N
a3cedcb3-8a01-4b12-98b8-a70d1647176f	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	sinetone A3 220 Hz	\N	\N	2025-10-20 22:06:16.029031	2025-10-20 22:06:16.029031	\N
52211b41-112d-4c6c-ab3b-582ec3ac1a1a	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	sinetone A#3 223.08 Hz	\N	\N	2025-10-20 22:06:16.034587	2025-10-20 22:06:16.034587	\N
a55c3ce7-d349-46f0-874e-8649bfcdfc7f	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	sinetone B3 246.94 Hz	\N	\N	2025-10-20 22:06:16.039478	2025-10-20 22:06:16.039478	\N
e41df3dc-4fe3-45b2-a295-bbc15946351d	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	sinetone C4 261.63 Hz	\N	\N	2025-10-20 22:06:16.044411	2025-10-20 22:06:16.044411	\N
388a5840-f952-4f8b-a7a1-3fcf62730067	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	sinetone C#4 277.18 Hz	\N	\N	2025-10-20 22:06:16.049187	2025-10-20 22:06:16.049187	\N
70b489da-0eba-4a2c-a9b6-7a512985176e	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	sinetone D4 293.66 Hz	\N	\N	2025-10-20 22:06:16.054325	2025-10-20 22:06:16.054325	\N
6c540576-b348-405c-b553-f42490f94490	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	sinetone D#4 311.13 Hz	\N	\N	2025-10-20 22:06:16.059539	2025-10-20 22:06:16.059539	\N
b93b9e19-f03f-4efd-a3f7-40b6fa06253b	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	sinetone E4 329.63	\N	\N	2025-10-20 22:06:16.064699	2025-10-20 22:06:16.064699	\N
dda70f61-d567-4192-ba3a-cd16d8a6e8a2	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	sinetone F4 349.23 Hz	\N	\N	2025-10-20 22:06:16.070253	2025-10-20 22:06:16.070253	\N
7d49908e-b434-424b-8dec-27bee220ab12	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	sinetone F#4 369.99 Hz	\N	\N	2025-10-20 22:06:16.074828	2025-10-20 22:06:16.074828	\N
9bcea813-fef7-4de9-ad1d-3d9fb18577e5	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	sinetone G4 392.0 Hz	\N	\N	2025-10-20 22:06:16.080115	2025-10-20 22:06:16.080115	\N
9ca22434-f299-41fe-822a-f933267a4107	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	sinetone G#4 415.3 Hz	\N	\N	2025-10-20 22:06:16.085027	2025-10-20 22:06:16.085027	\N
e01c6445-1654-4c93-b8aa-fa164f0a091a	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	sinetone A4 440.0 Hz	\N	\N	2025-10-20 22:06:16.090111	2025-10-20 22:06:16.090111	\N
7de403f2-41d7-4848-a696-36b853cccef6	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	sinetone A#4 466.16 Hz	\N	\N	2025-10-20 22:06:16.095848	2025-10-20 22:06:16.095848	\N
6f1a9eaf-7715-4588-9cdc-f9be2bea1fb2	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	sinetone B4 493.88 Hz	\N	\N	2025-10-20 22:06:16.100732	2025-10-20 22:06:16.100732	\N
8b63a78e-5a46-4a07-8cad-be8289b8f046	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	sinetone C5 523.25	\N	\N	2025-10-20 22:06:16.105569	2025-10-20 22:06:16.105569	\N
6560e070-055f-418d-9d74-f0624706bf85	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	sinetone C#5 554.37 Hz	\N	\N	2025-10-20 22:06:16.11097	2025-10-20 22:06:16.11097	\N
97bee48a-73f7-415c-9d6d-63937ae35819	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	sinetone D5 587.33 Hz	\N	\N	2025-10-20 22:06:16.116343	2025-10-20 22:06:16.116343	\N
8b62bfc1-4de9-4c8e-9563-9fc4d6b138fe	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	sinetone D#5 622.25	\N	\N	2025-10-20 22:06:16.121514	2025-10-20 22:06:16.121514	\N
158787da-417a-4fbd-a116-a206b31b0d89	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	sinetone E5 649.26 Hz	\N	\N	2025-10-20 22:06:16.126356	2025-10-20 22:06:16.126356	\N
b4e91ce3-8d1c-43d5-a8e5-15efe67fdd48	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Bateson Quote	\N	\N	2025-10-20 22:06:16.131287	2025-10-20 22:06:16.131287	\N
0620ca08-1f59-443b-ac69-8bb524a0fce4	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	All On Stage	\N	\N	2025-10-20 22:06:16.136485	2025-10-20 22:06:16.136485	\N
61db5fbe-1c74-42b0-9808-35cdf38041b1	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Repeat everything I say	\N	\N	2025-10-20 22:06:16.150947	2025-10-20 22:06:16.150947	\N
6f408f9a-66a2-47eb-9cf0-73ac64c20347	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Wow	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.155778	2025-10-20 22:06:16.155778	\N
53b000d0-0ef2-44a6-bf12-f04366cfe73e	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Look Left	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.160639	2025-10-20 22:06:16.160639	\N
353df766-9400-49d4-bf3a-2582f160d75f	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Interpret the following words	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.165738	2025-10-20 22:06:16.165738	\N
dc13499e-5ace-4b4c-93ac-3ef4fb8ef270	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Name your Text-To-Speech Here	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.171503	2025-10-20 22:06:16.171503	\N
3cd45178-13d0-4096-9de8-398c1fc6b627	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Name your Text-To-Speech Here	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.176441	2025-10-20 22:06:16.176441	\N
f1825f7a-7f2c-4b8d-9cd0-0bded4b4b483	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	mac and cheese	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.18153	2025-10-20 22:06:16.18153	\N
c7cfce7d-6fd9-4e0f-9fcc-e9e1babe9541	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Private Selection	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.186418	2025-10-20 22:06:16.186418	\N
bb9fb9e8-53a0-4187-b16d-2c9ebc90b467	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Yellow bow to pink	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.191398	2025-10-20 22:06:16.191398	\N
ae2bf5b6-73f1-4599-9fce-aec6654b2716	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Bow to Yellow	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.19625	2025-10-20 22:06:16.19625	\N
f2f50c67-80b1-4371-9535-25412c12ac84	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	DCD to facing	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.201418	2025-10-20 22:06:16.201418	\N
e5339444-2273-4016-ab7c-b8f71cedb167	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Left hand carousel all	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.20606	2025-10-20 22:06:16.20606	\N
b702f3fa-443d-49e6-b722-ae88340cb3be	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Right hand carousel all	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.21071	2025-10-20 22:06:16.21071	\N
4eeebb73-8bd0-489a-8868-2dd6cd26328c	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	pass thru to orange	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.215486	2025-10-20 22:06:16.215486	\N
005e2036-0462-46f4-bdeb-72d1462a4298	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Close the gate all	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.220565	2025-10-20 22:06:16.220565	\N
528d7595-9155-45ca-a4df-b9bf85bf7614	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	bow to green	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.226098	2025-10-20 22:06:16.226098	\N
2223e71e-8cab-4bc0-94ab-a5de34038a94	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Yellow DCD to pink	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.231311	2025-10-20 22:06:16.231311	\N
14343b1e-9297-416f-a65f-303863357e62	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Pink passes through to green	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.236024	2025-10-20 22:06:16.236024	\N
493e9b90-4895-454e-89cd-5f2654330833	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Pink close gate with orange	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.240938	2025-10-20 22:06:16.240938	\N
2dd77819-2d1a-4e19-bcf5-1078fe585d43	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Pink closes gate with yellow	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.245845	2025-10-20 22:06:16.245845	\N
ff35711c-fd4a-4abe-9004-1c45cc6ac814	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Pink closes gate with green	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.250529	2025-10-20 22:06:16.250529	\N
2e04973c-02d8-4d88-bf94-e8a8c60e989e	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Yellow close with orange	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.255033	2025-10-20 22:06:16.255033	\N
0f9b654a-6f8d-4ceb-9946-6e8c2456ba02	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Green closes with pink	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.26006	2025-10-20 22:06:16.26006	\N
ac6e89ae-5a48-4d4c-8d57-e526d6afcba9	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Yellow closes gate with pink	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.265412	2025-10-20 22:06:16.265412	\N
35bae360-ef1b-4cfc-a15b-fe34f088765f	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Orange closes gate with pink	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.270548	2025-10-20 22:06:16.270548	\N
705268b8-7bed-427a-82cf-3222a2291fd2	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Yellow closes gate with green	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.275595	2025-10-20 22:06:16.275595	\N
9e9be4b2-1d46-4a8b-b1cf-be8afe3801b8	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Orange closes gate with yellow	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.28492	2025-10-20 22:06:16.28492	\N
b36d8c3c-eb90-48b8-8103-41e9672b0146	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Orange closes gate with yellow	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.290644	2025-10-20 22:06:16.290644	\N
4e330357-abe3-45cc-965f-bf45dfc219aa	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Green closes with yellow	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.295694	2025-10-20 22:06:16.295694	\N
2df2a9a7-e5c6-4ab7-876e-3927aca3233e	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Right hand star all	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.301346	2025-10-20 22:06:16.301346	\N
eecff7b7-58c8-4460-894a-210c34418bd3	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Doe see doe to pink	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.306333	2025-10-20 22:06:16.306333	\N
e282f95c-ce8a-4e51-ac2b-9a891549ec53	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Doe see do to yellow	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.311348	2025-10-20 22:06:16.311348	\N
83345ef9-968c-46ab-bd89-9d3e8a8de299	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Doe see doe to orange	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.316594	2025-10-20 22:06:16.316594	\N
47f99925-8cc0-4d00-99ad-74cb956c10ca	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Pass through to green	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.32162	2025-10-20 22:06:16.32162	\N
cbaf830c-c4b7-4588-a315-af031bbb8d98	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Fried chicken	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.326485	2025-10-20 22:06:16.326485	\N
6f46345e-0086-4f85-8552-9649941d6378	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Star	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.331756	2025-10-20 22:06:16.331756	\N
186818d6-d0e9-4664-a6df-c844542a3988	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Hokey pokey	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.336961	2025-10-20 22:06:16.336961	\N
bbfd5836-8172-49f6-8f4e-c79b89e817f8	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Swing your partner all	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.341749	2025-10-20 22:06:16.341749	\N
8caed81a-1583-4463-aea1-e2a3b094e042	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Bow to your partner all	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.346088	2025-10-20 22:06:16.346088	\N
9a2066d6-ff21-4ac2-b641-d5f935cac985	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Can can all	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.351508	2025-10-20 22:06:16.351508	\N
796b280f-44af-44ce-b1b2-5f0d541a4a9b	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Doe see doe to partner all	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.3559	2025-10-20 22:06:16.3559	\N
df2f4c6c-d567-4ddf-b31e-b30c8e31faf4	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Chase shaw say all	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.360412	2025-10-20 22:06:16.360412	\N
dbf3cbed-e62a-4598-bfe2-9aa3fc37862a	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Bow to Orange	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.364994	2025-10-20 22:06:16.364994	\N
f61903e4-2cc3-4d04-a5da-98cc3ebe7df9	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	Bow to pink	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.369739	2025-10-20 22:06:16.369739	\N
b4946b29-9c97-4f30-870b-ea1bac159020	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	 bow to square	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.374057	2025-10-20 22:06:16.374057	\N
7ccc2ca6-9cf3-4673-b6e3-561f9cc05eed	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	orange pass thru to yellow	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.378252	2025-10-20 22:06:16.378252	\N
1df9d531-c19a-4edc-89bd-eaf93a24045a	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	bow to facing all	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.383109	2025-10-20 22:06:16.383109	\N
decdeabb-1e64-47a0-b577-cb505d28399d	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	green pass thru to pink	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.387522	2025-10-20 22:06:16.387522	\N
7b29e581-dbef-40de-8d5a-e55096d3cc45	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	swing with yellow	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.391583	2025-10-20 22:06:16.391583	\N
302a3600-879c-4cb9-a77f-21fdf75afac6	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	swing with orange	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.395887	2025-10-20 22:06:16.395887	\N
42c81db3-8c56-463b-9568-312ad98291cd	4cd33b1b-898b-477d-bb01-23bc7a81b41f	audio	big old test	On Telebrain, Text-To-Speech audio can be saved in advance or generated in real-time during a performance. To make Text-To-Speech audio in advance, choose a language and then save up to 100 characters of text. When the save button is pressed, Telebrain saves an mp3 of the Text-To-Speech audio to the server. Text-To-Speech audio can be accessed during a performance or concatenated with other audio using the Audio Sentence functionality.	\N	2025-10-20 22:06:16.400918	2025-10-20 22:06:16.400918	\N
7ff34a18-5ca1-4cd8-96f9-6c755c8b8254	4cd33b1b-898b-477d-bb01-23bc7a81b41f	text	Shakespeare Quote	\N	\N	2025-10-20 22:06:16.406363	2025-10-20 22:06:16.406363	\N
aa07f958-a001-4be3-8273-10d6790d58de	4cd33b1b-898b-477d-bb01-23bc7a81b41f	text	Gertrude Stein	\N	\N	2025-10-20 22:06:16.411123	2025-10-20 22:06:16.411123	\N
51ba09be-a847-4190-9c95-422694cfa33f	4cd33b1b-898b-477d-bb01-23bc7a81b41f	text	Bateson Quote	\N	\N	2025-10-20 22:06:16.416132	2025-10-20 22:06:16.416132	\N
629ea8fb-ca5e-4b7e-9acd-d5136766298d	4cd33b1b-898b-477d-bb01-23bc7a81b41f	text	type the teleprompt	Teleprompts display text in the performance image view. Teleprompt parameters can be assigned, such as font, size, color, and background color.	\N	2025-10-20 22:06:16.420599	2025-10-20 22:06:16.420599	\N
bce797d5-a6c9-40fd-8c07-2fc6646735cc	4cd33b1b-898b-477d-bb01-23bc7a81b41f	timer	5.15 second timer TEST	\N	\N	2025-10-20 22:06:16.425309	2025-10-20 22:06:16.425309	\N
f5b2cdef-62b7-489e-bec4-750fa03b64a5	4cd33b1b-898b-477d-bb01-23bc7a81b41f	timer	1.5 second timer	\N	\N	2025-10-20 22:06:16.431125	2025-10-20 22:06:16.431125	\N
ef5032d1-9fa2-4890-ab5f-e508ecaf2f2c	4cd33b1b-898b-477d-bb01-23bc7a81b41f	timer	1 min 30 secs	\N	\N	2025-10-20 22:06:16.435823	2025-10-20 22:06:16.435823	\N
ff251faa-eba7-4cde-86ba-07ab7d74a963	4cd33b1b-898b-477d-bb01-23bc7a81b41f	timer	Name your Timer here.	Timers of particular lengths of time can be saved in advanced for use during a performance. Timers are necessary for synchronizing events on multiple devices since latency is generally inconsistent when delivering data from the server to multiple clients. Telebrain timers are self-adjusting and continually synchronize to the server clock in order to assure time-accuracy.	\N	2025-10-20 22:06:16.440143	2025-10-20 22:06:16.440143	\N
\.


--
-- Data for Name: swarm_content_audio; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.swarm_content_audio (id, content_id, source_type, url, file_path, duration_ms, format, bitrate, file_size_bytes, tts_text, tts_language, tts_voice, created_at) FROM stdin;
fe22d3c3-5fb1-4457-8043-15cbb148fe22	4810fa96-5ce9-4f1e-929f-7e5fbde24a33	url	http://www.sounddogs.com/sound-effects/2223/mp3/441201_SOUNDDOGS__do.mp3	http://www.sounddogs.com/sound-effects/2223/mp3/441201_SOUNDDOGS__do.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:15.961757
312cc7d8-66a1-462d-ae10-7aee20265505	548c2a15-9143-4f20-9b1c-d71bbf548645	url	http://www.sounddogs.com/sound-effects/3177/mp3/258845_SOUNDDOGS__co.mp3	http://www.sounddogs.com/sound-effects/3177/mp3/258845_SOUNDDOGS__co.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:15.967575
52025f3b-17a6-44d1-ae2f-754933b785d3	d1126a92-5bce-4c96-be0c-5d9b69e209c7	url	http://www.sounddogs.com/sound-effects/2904/mp3/615900_SOUNDDOGS__ma.mp3	http://www.sounddogs.com/sound-effects/2904/mp3/615900_SOUNDDOGS__ma.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:15.972813
ddad9f24-c598-4d9e-bf25-33924deb1d63	bcd83cdd-323f-4a34-9a6f-5edfc9abf319	upload	snd/uploads/Laugh.mp3	snd/uploads/Laugh.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:15.977675
a6adb1be-51b9-47b2-a76a-c2af95c0c449	5df3b4a8-f0b8-4456-bc12-89623d4ddc19	upload	snd/uploads/Slide.mp3	snd/uploads/Slide.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:15.982625
0beb37cf-0f67-4c0f-90b8-1b6c3e07a173	a52f103a-ca49-4de4-b021-afdc5991ee46	upload	snd/uploads/Spring.mp3	snd/uploads/Spring.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:15.987779
a8e592e6-f6ff-43dc-8795-b44e0eb7963d	ce30b3ea-8af4-46e0-90c0-e106f30c526a	upload	snd/uploads/Beep.mp3	snd/uploads/Beep.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:15.992839
18ca014f-2657-4c00-976a-289e7e9c72d0	edb6ff58-7b5a-4925-9481-1c503f36def7	upload	snd/uploads/DoubleBeep.mp3	snd/uploads/DoubleBeep.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:15.997578
5458c83c-bd39-4c8a-9267-98a646c3b267	d38c497e-a380-483e-ab28-e8221d51c60f	upload	snd/uploads/Ictus.mp3	snd/uploads/Ictus.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:16.002385
0f34b131-7f99-43ea-a1a9-bdd0c55eb923	d927c2f8-4431-4cb3-a206-42c223b79d2b	upload	snd/uploads/zuction.mp3	snd/uploads/zuction.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:16.00738
9892702c-a415-44d1-941d-5debd6ab6528	038a91ba-b45b-4dba-b4de-c158c7f77ea3	upload	snd/uploads/slideyup.mp3	snd/uploads/slideyup.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:16.012304
e0077adb-f435-401c-9ae7-3c5548bcb85f	dce6ad1b-446f-49da-b7a8-eda2312cc44d	upload	snd/uploads/slideyupbackwards.mp3	snd/uploads/slideyupbackwards.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:16.016932
4ee28dc5-047c-4214-be6b-808db81e0fb1	2262de67-300a-44fb-922e-876887e1c30d	upload	snd/uploads/noisehit.mp3	snd/uploads/noisehit.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:16.021457
4e576a50-f34a-4e98-b740-abd4665b3d17	6f0007e3-a1a3-410d-b174-bb81b3b32b47	upload	snd/uploads/chunkly.mp3	snd/uploads/chunkly.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:16.02635
bebb22f0-f6ed-4b23-bd94-09d9ddef84f4	a3cedcb3-8a01-4b12-98b8-a70d1647176f	upload	snd/uploads/A3-220.0.mp3	snd/uploads/A3-220.0.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:16.032239
2fb1fea3-2270-40b1-a671-c375d7405507	52211b41-112d-4c6c-ab3b-582ec3ac1a1a	upload	snd/uploads/Asharp3-233.08.mp3	snd/uploads/Asharp3-233.08.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:16.037048
2fecddbc-9af7-482c-bf80-a0f2180f3f55	a55c3ce7-d349-46f0-874e-8649bfcdfc7f	upload	snd/uploads/B3-246.94.mp3	snd/uploads/B3-246.94.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:16.042
943786c0-cdf2-4a5c-9c3c-d8c9165c3a46	e41df3dc-4fe3-45b2-a295-bbc15946351d	upload	snd/uploads/C4-261.63.mp3	snd/uploads/C4-261.63.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:16.046561
2f16b192-e940-4e9f-bad8-a49924546189	388a5840-f952-4f8b-a7a1-3fcf62730067	upload	snd/uploads/Csharp4-277.18.mp3	snd/uploads/Csharp4-277.18.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:16.051942
175e6403-017e-4cb3-ac10-86ce54904b2a	70b489da-0eba-4a2c-a9b6-7a512985176e	upload	snd/uploads/D4-293.66.mp3	snd/uploads/D4-293.66.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:16.057043
7e0b7087-333f-42d2-9af5-ea51adf5525c	6c540576-b348-405c-b553-f42490f94490	upload	snd/uploads/Dsharp4-311.13.mp3	snd/uploads/Dsharp4-311.13.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:16.062032
e7fa261b-da4e-46c6-8c6a-34b284e1388c	b93b9e19-f03f-4efd-a3f7-40b6fa06253b	upload	snd/uploads/E4-329.63.mp3	snd/uploads/E4-329.63.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:16.067671
a776721c-a26a-4be0-84af-5f1308eeaf54	dda70f61-d567-4192-ba3a-cd16d8a6e8a2	upload	snd/uploads/F4-349.23.mp3	snd/uploads/F4-349.23.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:16.072606
3c79ed0c-433b-4e1d-8784-5a8282835372	7d49908e-b434-424b-8dec-27bee220ab12	upload	snd/uploads/Fsharp4-369.99.mp3	snd/uploads/Fsharp4-369.99.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:16.077341
97f26888-ed51-445e-b231-3a32e3b9a409	9bcea813-fef7-4de9-ad1d-3d9fb18577e5	upload	snd/uploads/G4-392.0.mp3	snd/uploads/G4-392.0.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:16.082436
a21a37e4-64c5-44eb-be4a-1c3585d24e74	9ca22434-f299-41fe-822a-f933267a4107	upload	snd/uploads/Gsharp4-415.3.mp3	snd/uploads/Gsharp4-415.3.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:16.087639
ac6b8646-87f6-4f4b-8d69-d14c98a59836	e01c6445-1654-4c93-b8aa-fa164f0a091a	upload	snd/uploads/A4-440.0.mp3	snd/uploads/A4-440.0.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:16.09321
7772d27d-22ff-42ea-9976-f84de40d6741	7de403f2-41d7-4848-a696-36b853cccef6	upload	snd/uploads/Asharp4-466.16.mp3	snd/uploads/Asharp4-466.16.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:16.098418
cae2a2a6-cb4a-4a4f-9d69-0d220db4fff5	6f1a9eaf-7715-4588-9cdc-f9be2bea1fb2	upload	snd/uploads/B4-493.88.mp3	snd/uploads/B4-493.88.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:16.103025
b4c40306-31f4-407e-ad92-8b7f82ce0c4e	8b63a78e-5a46-4a07-8cad-be8289b8f046	upload	snd/uploads/C5-523.25.mp3	snd/uploads/C5-523.25.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:16.108376
87072fc9-54bb-4e06-9c1d-12c38b49925d	6560e070-055f-418d-9d74-f0624706bf85	upload	snd/uploads/Csharp5-554.37.mp3	snd/uploads/Csharp5-554.37.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:16.113738
fccbf1fd-00f6-4605-a8b7-a46aeaf29c4b	97bee48a-73f7-415c-9d6d-63937ae35819	upload	snd/uploads/D5-587.33.mp3	snd/uploads/D5-587.33.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:16.118969
b1662e06-68c3-41e5-9382-2b2e35947929	8b62bfc1-4de9-4c8e-9563-9fc4d6b138fe	upload	snd/uploads/Dsharp5-622.25.mp3	snd/uploads/Dsharp5-622.25.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:16.12386
49179beb-1661-44b0-abef-1949fc3cd04b	158787da-417a-4fbd-a116-a206b31b0d89	upload	snd/uploads/E5-659.26.mp3	snd/uploads/E5-659.26.mp3	\N	\N	\N	\N	\N	\N	\N	2025-10-20 22:06:16.128929
0854d276-eb1e-4b32-9574-ec8386418254	b4e91ce3-8d1c-43d5-a8e5-15efe67fdd48	tts	\N	snd/ttsdb/5103435ae0d1ac2d16000035.mp3	\N	\N	\N	\N	The computer never truly encounters logical paradox, but only the simulation of paradox...	en	\N	2025-10-20 22:06:16.133769
65950912-1e08-42b8-a2ae-6f4b8df75c1c	0620ca08-1f59-443b-ac69-8bb524a0fce4	tts	\N	snd/ttsdb/5103435ae0d1ac2d16000036.mp3	\N	\N	\N	\N	All Onstage	en	\N	2025-10-20 22:06:16.138851
668a3851-f625-4c8e-87dc-f7c43d991a3e	2fd9e298-5fb4-4657-86b0-f26ad0c3269b	tts	\N	snd/ttsdb/5103435ae0d1ac2d16000037.mp3	\N	\N	\N	\N	Swing your partner to the left	en	\N	2025-10-20 22:06:16.143732
ad9863a0-44ae-470a-a971-3aa6e42a2b65	33ae332f-7440-4742-888b-17380de89583	tts	\N	snd/ttsdb/5103435ae0d1ac2d16000038.mp3	\N	\N	\N	\N	When you hear this sound	en	\N	2025-10-20 22:06:16.14875
3a6ca61f-b15b-42a7-8d60-0eec6b544ec9	61db5fbe-1c74-42b0-9808-35cdf38041b1	tts	\N	snd/ttsdb/5103435ae0d1ac2d16000039.mp3	\N	\N	\N	\N	Repeat everything I say	en	\N	2025-10-20 22:06:16.153269
eea56e11-39a3-44bd-9a84-c021d4c909e1	6f408f9a-66a2-47eb-9cf0-73ac64c20347	tts	\N	snd/ttsdb/510644b9cd3bb8ac47000005.mp3	\N	\N	\N	\N	All off stage	en	\N	2025-10-20 22:06:16.158352
de6c479d-2f12-49f3-8aa7-8d4132787a3f	53b000d0-0ef2-44a6-bf12-f04366cfe73e	tts	\N	snd/ttsdb/51064563cd3bb8ac4700000a.mp3	\N	\N	\N	\N	WHAT THE FUCK	en	\N	2025-10-20 22:06:16.16322
9ac6b42e-b280-41a5-97be-8cf7d1541cf9	353df766-9400-49d4-bf3a-2582f160d75f	tts	\N	snd/ttsdb/51064616cd3bb8ac47000015.mp3	\N	\N	\N	\N	Interpret the following words	en	\N	2025-10-20 22:06:16.168137
302f315b-2838-45a6-ad85-569094ccc77c	dc13499e-5ace-4b4c-93ac-3ef4fb8ef270	tts	\N	snd/ttsdb/5106d575f911d23e38000003.mp3	\N	\N	\N	\N	play as many notes as possilble	en	\N	2025-10-20 22:06:16.173997
388c027f-8ea4-4a2c-a5a1-9f7f101e13a0	3cd45178-13d0-4096-9de8-398c1fc6b627	tts	\N	snd/ttsdb/511d659dd58196c638000004.mp3	\N	\N	\N	\N	HELLO LOVER	en	\N	2025-10-20 22:06:16.178927
ec131654-d52d-462b-a66a-076debf5039c	f1825f7a-7f2c-4b8d-9cd0-0bded4b4b483	tts	\N	snd/ttsdb/512d455cd58196c638000008.mp3	\N	\N	\N	\N	jump up and down with macaroni and cheese	en	\N	2025-10-20 22:06:16.184072
427af590-be0e-47e5-964a-76c7125adc2a	c7cfce7d-6fd9-4e0f-9fcc-e9e1babe9541	tts	\N	snd/ttsdb/512d45c908e3c0af35000002.mp3	\N	\N	\N	\N	Seleccion Privada	es	\N	2025-10-20 22:06:16.188928
353a8540-d645-448a-8c64-bc05b274ad70	bb9fb9e8-53a0-4187-b16d-2c9ebc90b467	tts	\N	snd/ttsdb/5171ba74639e3c013f00000f.mp3	\N	\N	\N	\N	Bow To. Pink. and make a wink	en	\N	2025-10-20 22:06:16.1937
261e38ff-d363-4e4b-ad4d-b8ebd20809dc	ae2bf5b6-73f1-4599-9fce-aec6654b2716	tts	\N	snd/ttsdb/5171bb9f639e3c013f000010.mp3	\N	\N	\N	\N	Bough. to yellow, you fine fellow.	en	\N	2025-10-20 22:06:16.198855
95e3dc3d-62ef-4f17-bf8d-f36e9e77bdbd	f2f50c67-80b1-4371-9535-25412c12ac84	tts	\N	snd/ttsdb/5171bc96639e3c013f000011.mp3	\N	\N	\N	\N	Doe see doe to facing. yay.  Doe see doe to facing! yay!	en	\N	2025-10-20 22:06:16.203701
6162deb3-0bd0-4107-88d5-9556970eb0ab	e5339444-2273-4016-ab7c-b8f71cedb167	tts	\N	snd/ttsdb/5171bd3e639e3c013f000012.mp3	\N	\N	\N	\N	Carousel with your left hand. Then End up where you began!	en	\N	2025-10-20 22:06:16.208387
bacd1fe0-6ca1-4226-a5f7-1a9b7f2028e9	b702f3fa-443d-49e6-b722-ae88340cb3be	tts	\N	snd/ttsdb/5171be6c639e3c013f000013.mp3	\N	\N	\N	\N	Right hand now. Let's carousel. Go back home now. Do it well!	en	\N	2025-10-20 22:06:16.21309
efc075bf-87e3-4df7-820c-eb30fb68ab8c	4eeebb73-8bd0-489a-8868-2dd6cd26328c	tts	\N	snd/ttsdb/5171bfb3639e3c013f000014.mp3	\N	\N	\N	\N	Shake hands with orange and pass on through. Howdy partner, how dee do?	en	\N	2025-10-20 22:06:16.218023
40989b85-838b-4ea4-9f3d-ee4f10b120da	005e2036-0462-46f4-bdeb-72d1462a4298	tts	\N	snd/ttsdb/5171bffc639e3c013f000015.mp3	\N	\N	\N	\N	Close the gate. Don't be late.	en	\N	2025-10-20 22:06:16.223039
1f302e70-e8ee-4a39-a850-2d8b97bb5f0f	528d7595-9155-45ca-a4df-b9bf85bf7614	tts	\N	snd/ttsdb/5171c070639e3c013f000016.mp3	\N	\N	\N	\N	Bough to green. Don't be mean.	en	\N	2025-10-20 22:06:16.228612
50610258-9c46-4935-8246-89840be30173	2223e71e-8cab-4bc0-94ab-a5de34038a94	tts	\N	snd/ttsdb/5171c121639e3c013f000017.mp3	\N	\N	\N	\N	Doe see doe to pink. Pink don't stink. 	en	\N	2025-10-20 22:06:16.233572
f6d84dd5-d98d-4cd5-a57a-4ab51158d622	14343b1e-9297-416f-a65f-303863357e62	tts	\N	snd/ttsdb/5171c613639e3c013f000018.mp3	\N	\N	\N	\N	Shake green's hand and pass on through. That is all you need to do. 	en	\N	2025-10-20 22:06:16.238556
91ad2c59-91a5-458d-8944-6659f2f008a1	493e9b90-4895-454e-89cd-5f2654330833	tts	\N	snd/ttsdb/5171c704639e3c013f000019.mp3	\N	\N	\N	\N	Close orange's gate. Now don't be late.	en	\N	2025-10-20 22:06:16.243329
ca75304c-3a01-4b7b-89ba-c7f2b26822aa	2dd77819-2d1a-4e19-bcf5-1078fe585d43	tts	\N	snd/ttsdb/5171c75b639e3c013f00001a.mp3	\N	\N	\N	\N	Close yellow's gate. Now don't be late.	en	\N	2025-10-20 22:06:16.248326
4b835d98-ee80-4674-ab81-f6aeabf5d483	ff35711c-fd4a-4abe-9004-1c45cc6ac814	tts	\N	snd/ttsdb/5171c79f639e3c013f00001b.mp3	\N	\N	\N	\N	Close green's gate. Now don't be late.	en	\N	2025-10-20 22:06:16.252763
c8920937-51e6-46e7-ba36-b698746e47f1	2e04973c-02d8-4d88-bf94-e8a8c60e989e	tts	\N	snd/ttsdb/5171c856639e3c013f00001c.mp3	\N	\N	\N	\N	Close orange's gate. Now don't be late.	en	\N	2025-10-20 22:06:16.257378
8dbfd415-7add-4ece-a862-ccb73d66b328	0f9b654a-6f8d-4ceb-9946-6e8c2456ba02	tts	\N	snd/ttsdb/5171c8c1639e3c013f00001e.mp3	\N	\N	\N	\N	Close pinky's gate. Now don't be late.	en	\N	2025-10-20 22:06:16.262772
f61bb6dd-fdbd-4ba1-8846-112fb1869277	ac6e89ae-5a48-4d4c-8d57-e526d6afcba9	tts	\N	snd/ttsdb/5171c903639e3c013f00001f.mp3	\N	\N	\N	\N	Close pinky's gate. Now don't be late.	en	\N	2025-10-20 22:06:16.268093
b677ee1e-c83c-40f9-bd54-bc83a9aa09aa	35bae360-ef1b-4cfc-a15b-fe34f088765f	tts	\N	snd/ttsdb/5171c967639e3c013f000020.mp3	\N	\N	\N	\N	Close pinky's gate. Now don't be late.	en	\N	2025-10-20 22:06:16.27319
387d070e-9fe1-4220-a5ea-53402398a04d	705268b8-7bed-427a-82cf-3222a2291fd2	tts	\N	snd/ttsdb/5171c9a7639e3c013f000021.mp3	\N	\N	\N	\N	Close greeny's gate. Now don't be late.	en	\N	2025-10-20 22:06:16.277884
396bd339-0732-4ad8-9b65-27581aac93ad	9e9be4b2-1d46-4a8b-b1cf-be8afe3801b8	tts	\N	snd/ttsdb/5171ca31639e3c013f000023.mp3	\N	\N	\N	\N	Close yellow's gate. Now don't be late.	en	\N	2025-10-20 22:06:16.288031
567c2f9b-f40d-45ad-bd86-40e8a3e2e7e4	b36d8c3c-eb90-48b8-8103-41e9672b0146	tts	\N	snd/ttsdb/5171ca6b639e3c013f000024.mp3	\N	\N	\N	\N	Close yellow's gate. Now don't be late.	en	\N	2025-10-20 22:06:16.293024
e77b4844-ea9a-45a2-967c-bff6e4ed1b62	4e330357-abe3-45cc-965f-bf45dfc219aa	tts	\N	snd/ttsdb/5171ca9b639e3c013f000025.mp3	\N	\N	\N	\N	Close yellow's gate. Now don't be late.	en	\N	2025-10-20 22:06:16.29862
9681ff99-0dc9-4c5c-addd-e03a961c7ecb	2df2a9a7-e5c6-4ab7-876e-3927aca3233e	tts	\N	snd/ttsdb/5171d1f1639e3c013f000026.mp3	\N	\N	\N	\N	Right hand star. then back to your color! 	en	\N	2025-10-20 22:06:16.30378
89fdedeb-5600-4bb9-8c13-acce5b2afb6b	eecff7b7-58c8-4460-894a-210c34418bd3	tts	\N	snd/ttsdb/5171d4de639e3c013f000027.mp3	\N	\N	\N	\N	Doe see doe to pink.     Your feet stink! 	en	\N	2025-10-20 22:06:16.308749
a7f75e0b-5763-491c-b8a0-aa5eadeda6b8	e282f95c-ce8a-4e51-ac2b-9a891549ec53	tts	\N	snd/ttsdb/5171d665639e3c013f000028.mp3	\N	\N	\N	\N	Doe see doe to yellow.     Then say hell oh.	en	\N	2025-10-20 22:06:16.313847
94dda198-a0f5-4a0f-8ffe-f9bcb0ad2820	83345ef9-968c-46ab-bd89-9d3e8a8de299	tts	\N	snd/ttsdb/5171d760639e3c013f000029.mp3	\N	\N	\N	\N	Doe see doe To orange now. Don't stub your toe.  ow.	en	\N	2025-10-20 22:06:16.319206
660e54dd-c7fc-459a-8f14-50caeddddc83	47f99925-8cc0-4d00-99ad-74cb956c10ca	tts	\N	snd/ttsdb/5171d8b9639e3c013f00002b.mp3	\N	\N	\N	\N	Shake hands with green and pass on through. Howdy partner, how dee do?	en	\N	2025-10-20 22:06:16.32415
af17dd5d-950c-45b9-9842-444b29104909	cbaf830c-c4b7-4588-a315-af031bbb8d98	tts	\N	snd/ttsdb/5171daca639e3c013f00002e.mp3	\N	\N	\N	\N	Do the fried chicken. Do it like the dickens.	en	\N	2025-10-20 22:06:16.328807
d4a06f81-360a-4bb3-8cc7-77183ae72651	6f46345e-0086-4f85-8552-9649941d6378	tts	\N	snd/ttsdb/5171db1c639e3c013f00002f.mp3	\N	\N	\N	\N	RIght hand. Now you do the star.  The star will take you far. 	en	\N	2025-10-20 22:06:16.334527
3da78c8d-aa72-4905-b08f-54ca4810c8d6	186818d6-d0e9-4664-a6df-c844542a3988	tts	\N	snd/ttsdb/5171dbd5639e3c013f000030.mp3	\N	\N	\N	\N	Do the hokey pokey.   This is not a jokey.	en	\N	2025-10-20 22:06:16.339464
cc03bb64-49d0-482b-8549-650fbdfc8ff4	bbfd5836-8172-49f6-8f4e-c79b89e817f8	tts	\N	snd/ttsdb/5171dc72639e3c013f000031.mp3	\N	\N	\N	\N	Swing your partner all around.    Swing this party. to  the  ground.	en	\N	2025-10-20 22:06:16.343858
06f2a2db-e27e-463b-80ba-0b7eb6fa4049	8caed81a-1583-4463-aea1-e2a3b094e042	tts	\N	snd/ttsdb/5171dd09639e3c013f000032.mp3	\N	\N	\N	\N	Now bow to your partner and say hello.	en	\N	2025-10-20 22:06:16.348909
581b4fbf-4ace-49d2-838d-7bdf0250f9af	9a2066d6-ff21-4ac2-b641-d5f935cac985	tts	\N	snd/ttsdb/5171dd83639e3c013f000033.mp3	\N	\N	\N	\N	 Can can . do it. yes you can. 	en	\N	2025-10-20 22:06:16.353784
4aada18f-6606-4f47-af5b-de45b6ff8a37	796b280f-44af-44ce-b1b2-5f0d541a4a9b	tts	\N	snd/ttsdb/5171de63639e3c013f000034.mp3	\N	\N	\N	\N	Grab your partner and Doe see doe, doe see doe, doe. See. Doe. .	en	\N	2025-10-20 22:06:16.358349
5de9cc86-c49e-48dc-a714-6510d1d1518a	df2f4c6c-d567-4ddf-b31e-b30c8e31faf4	tts	\N	snd/ttsdb/5171ded9639e3c013f000035.mp3	\N	\N	\N	\N	Shaw say shaw say shaw say ya'll. shaw say one and shaw say all. 	en	\N	2025-10-20 22:06:16.362569
0f1ec722-055e-492c-9a01-09b41cdb19dd	dbf3cbed-e62a-4598-bfe2-9aa3fc37862a	tts	\N	snd/ttsdb/5171e7bb639e3c013f00003c.mp3	\N	\N	\N	\N	Bough. To Orange. Bow wow wow!	en	\N	2025-10-20 22:06:16.367462
12f545cb-2c9b-46f9-bef9-18ea03199efc	f61903e4-2cc3-4d04-a5da-98cc3ebe7df9	tts	\N	snd/ttsdb/5171e7ed639e3c013f00003d.mp3	\N	\N	\N	\N	Bough. To pink. Pink don't stink. 	en	\N	2025-10-20 22:06:16.371955
4b23f521-8606-4238-b7ca-b6f4c7626509	b4946b29-9c97-4f30-870b-ea1bac159020	tts	\N	snd/ttsdb/5171eb28639e3c013f00003f.mp3	\N	\N	\N	\N	Bough. to square.  Don't despair. 	en	\N	2025-10-20 22:06:16.376208
99bebb0c-f8de-4a76-908f-34942710c36f	7ccc2ca6-9cf3-4673-b6e3-561f9cc05eed	tts	\N	snd/ttsdb/5171eece639e3c013f000044.mp3	\N	\N	\N	\N	Pass on through to yellow, You funky fellow.	en	\N	2025-10-20 22:06:16.380361
8128f37b-b7b1-4b4a-927e-e7306fc62f5c	1df9d531-c19a-4edc-89bd-eaf93a24045a	tts	\N	snd/ttsdb/5171f098639e3c013f000047.mp3	\N	\N	\N	\N	Bough.  to facing.  there you go.     bough. to facing and say hello! 	en	\N	2025-10-20 22:06:16.385368
6d62f170-86b7-4467-8c92-733b5ff242bd	decdeabb-1e64-47a0-b577-cb505d28399d	tts	\N	snd/ttsdb/5171fa0e639e3c013f000049.mp3	\N	\N	\N	\N	Pass through to pink now. Pass on through.	en	\N	2025-10-20 22:06:16.389533
3245b2a3-368f-4a65-90d7-01990cfeecf5	7b29e581-dbef-40de-8d5a-e55096d3cc45	tts	\N	snd/ttsdb/5171fac4639e3c013f00004c.mp3	\N	\N	\N	\N	swing with yellow! swing it swing	en	\N	2025-10-20 22:06:16.393702
78f68141-3bd9-49b8-b1ee-c5317c28b619	302a3600-879c-4cb9-a77f-21fdf75afac6	tts	\N	snd/ttsdb/5171faf1639e3c013f00004d.mp3	\N	\N	\N	\N	swing with orange! swing it swing	en	\N	2025-10-20 22:06:16.398496
1cd46dab-9c36-4e21-8b86-293342c9e56c	42c81db3-8c56-463b-9568-312ad98291cd	tts	\N	snd/ttsdb/58f911046c3b02bf70000001.mp3	\N	\N	\N	\N	big old test	en	\N	2025-10-20 22:06:16.403333
\.


--
-- Data for Name: swarm_content_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.swarm_content_images (id, content_id, source_type, url, file_path, width, height, format, file_size_bytes, created_at) FROM stdin;
7ab21f0c-8ec3-414a-963d-f15e8fa914ce	fc156964-7763-4819-a0c4-29c30b78a1d9	url	http://blogfiles.wfmu.org/KF/2007/01/note/musical%20notation.gif	\N	\N	\N	\N	\N	2025-10-20 22:06:15.610803
2d3dd3b3-515d-4d78-bf06-3e3838e9882c	502d43bd-2dea-44de-8fcb-a1ee5e26e875	url	http://blogfiles.wfmu.org/KF/2007/01/note/cardew_-_treatiseP183.jpg	\N	\N	\N	\N	\N	2025-10-20 22:06:15.617583
8e29fb88-6b74-4e46-b3dd-fea2a7b661e8	ca801f52-aa65-4cf0-915c-b6cee643ea1c	url	https://media3.giphy.com/media/K8CMlxipnbfIA/giphy.gif	\N	\N	\N	\N	\N	2025-10-20 22:06:15.623081
e22ad2d8-fff2-4321-bc3f-082b7eabee88	75f93aec-12fa-471f-b644-7dd4340eaf0e	url	http://www.johnston.k12.ia.us/schools/elemlmc/images/count2.gif	\N	\N	\N	\N	\N	2025-10-20 22:06:15.628687
5e5b743c-c348-48e0-9e87-3fd282ce0c9d	a3967c17-acf3-4dd7-a2ee-5cb1159b9cf1	url	pics/imageURL.jpg	\N	\N	\N	\N	\N	2025-10-20 22:06:15.633716
da5b09ab-22f6-4f21-aab7-d0cd2282bcb7	e2d32f12-2abf-4ca9-b6de-8892a3aa784d	url	pics/imageURL.jpg	\N	\N	\N	\N	\N	2025-10-20 22:06:15.638335
5b85ac64-d714-4c83-95ab-20e988eded43	d296fdda-05da-4291-97fb-c32b04f06496	upload	pics/imageUpload.jpg	\N	\N	\N	\N	\N	2025-10-20 22:06:15.643442
fb697672-4ae1-4c4c-a382-a823838687b0	6ac07f8b-4827-4e17-837c-90d312c3a930	upload	pics/arrows.jpg	\N	\N	\N	\N	\N	2025-10-20 22:06:15.648698
8f3a25e0-8385-4432-b5c3-7c6c3d11cb19	70578489-092a-4d96-a75c-87ac95ce8f13	upload	pics/metronome_ani.gif	\N	\N	\N	\N	\N	2025-10-20 22:06:15.653862
2eaa398d-ced3-406c-a42e-22a8264912f0	03b2a8d4-088d-4685-8324-3e7a5c192ba3	upload	pics/music-example.jpg	\N	\N	\N	\N	\N	2025-10-20 22:06:15.658938
3ab9091d-2ce8-412c-87fb-392203bba571	cbe08b8e-69f2-49c4-affb-ae63a793fa9d	upload	pics/notation-chemical.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.664006
51831b6d-60b7-475d-81cc-1a43dd1b4598	4e53ffca-cd17-4d1f-9c86-da2bafb3bd28	upload	pics/record.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.669853
cc5a52ae-78a4-4445-8347-30da1cde6f2b	40754386-a009-4cea-8773-6d7210dc30b8	upload	pics/repeat.jpg	\N	\N	\N	\N	\N	2025-10-20 22:06:15.674772
e829f3d7-0d0d-4b34-ad11-9acbd6c9956e	9911d47c-a874-49e7-850b-aff1f69269d2	upload	pics/tango.jpg	\N	\N	\N	\N	\N	2025-10-20 22:06:15.679799
e4ff5f31-b1c2-406a-8353-eb963e6f88e2	a5c143f5-f16c-47f5-8676-db456d1b5dac	upload	pics/conductor.gif	\N	\N	\N	\N	\N	2025-10-20 22:06:15.685722
5df4f651-1fd0-4d6e-b50b-1c1f698dd054	242c1bf8-47c8-40f6-b8fa-aaeb77058627	upload	pics/chaos.jpg	\N	\N	\N	\N	\N	2025-10-20 22:06:15.690396
a29e3e6b-8abf-4ae9-9f70-914a8551e950	3c73b04d-2121-4ca8-835f-a55dd527e3aa	upload	pics/AMajor.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.695625
bf6fe00c-f851-4fbf-bee9-df4e3aa0374a	de8187c5-03d5-40a5-a825-5d63a6ce2bbb	upload	pics/uploads/A3.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.700715
993daee9-7283-4f62-acb5-b6b1d7cec839	c72a73fe-0982-4625-a716-eb46db7fb792	upload	pics/uploads/Bflat3.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.706421
0889840b-d7e7-44c7-b106-95f9feadff4a	4b3c4e0a-4899-4dc5-8a28-e5565f969796	upload	pics/uploads/B3.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.711457
7db51dfd-5d57-48cb-9c79-413ca2ce03b4	1b02ea8a-ef32-428e-9ac9-6d2c85d046f0	upload	pics/uploads/C4.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.715993
2100cbce-e4f3-4e20-a758-907ccde35366	f5fe7dfe-1adf-4cf7-8a13-8bd21b4a4382	upload	pics/uploads/Csharp4.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.720553
25387f76-42b1-44de-a61f-784dc356bc4e	8eee36e7-1afc-43fd-832f-c5901715b483	upload	pics/uploads/D4.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.725496
d3117fa7-1c3d-440b-a063-4624c21b24b6	0e4f3c5e-dbc7-4c7e-9c2d-218283c4c19d	upload	pics/uploads/Eflat4.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.730755
f25ea6a2-b2c5-4126-bf4c-6cefaf93cc8a	420230bb-44ef-42d2-8090-41966bde9d98	upload	pics/uploads/E4.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.735929
40160635-512d-403e-8394-6db194729885	4cb4fe7d-1683-48b5-b9e6-314f1540768a	upload	pics/uploads/F4.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.741098
ab061793-ab58-4cb2-b6a2-bccd20b1d8d2	e6e7cb1d-ecec-4c42-bdb4-a35fb306ba3f	upload	pics/uploads/Fsharp4.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.745852
a3f0697d-9ba1-456e-b922-9a566e7cba01	2ba7000e-52fd-4752-bb0c-127b20b158b7	upload	pics/uploads/G4.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.751125
d94318fb-7748-4501-a5e0-d65a8f8f8bec	81f97481-8b5b-4df7-a296-9085bde2eeb4	upload	pics/uploads/Gsharp4.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.756406
b84725ee-c64b-4868-9e4e-623133bcfbd2	eee527fc-b888-4c85-8987-26efdfff042f	upload	pics/uploads/A4.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.761436
d4746d40-4afd-43e1-a640-51e49afe1d3f	321db19a-5d44-4613-a696-86798f5e8191	upload	pics/uploads/Bflat4.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.766743
3081e22e-7aa0-4ddd-a67d-9dfe594de672	4aba2c4a-8e0d-4701-9a05-8d056445cf72	upload	pics/uploads/B4.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.771544
605730b7-3712-4e60-854d-74b87eb6cbf2	fa801f1f-cbce-4319-bef0-94cfa71801d5	upload	pics/uploads/C5.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.776638
c796ee34-ac86-496b-83d7-7f95c66fca90	18e32bf0-5d70-4701-9e33-b12448fa431f	upload	pics/uploads/Csharp5.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.781743
bfa66593-b1a6-44d5-9f06-2b2e63845ea1	9c26972f-6c4c-4197-be41-b9997991ebea	upload	pics/uploads/D5.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.786517
ebb24984-bf31-4918-b6eb-f3d2907c8dd0	4805907d-f12a-434d-925b-561795b46524	upload	pics/uploads/Eflat5.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.791277
225eead2-245c-4cd5-87d3-84a072e32d90	eecb7929-252c-4426-8e74-d2c14b97737f	upload	pics/uploads/E5.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.79622
275774bf-1a73-4a96-a1e3-523e4de1d163	7f13835e-94a2-49f2-88d2-5be9d775dd6e	upload	pics/uploads/uturn.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.800816
039c0fc5-fbac-4f5c-9ce0-4e8c0e2dddff	7db6c81d-c624-4ef9-b01b-0ff03fbd2dc3	upload	pics/uploads/nobikes.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.805608
d528455d-f22e-4162-b3e7-75df131589fc	3d3fc5ae-3863-497f-84d1-56a21ef61734	upload	pics/uploads/yieldahead.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.810823
b4ef7d3a-9e01-490b-9ae7-628e75135306	445fb098-61d0-48f4-b6eb-c3f932dec1f8	upload	pics/uploads/jogright.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.817051
2c90ad5a-754a-4dd3-8463-3bba067fed8c	924665ff-f467-438d-b993-41a61abbd574	upload	pics/uploads/passing.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.823399
6f68d1e5-44c1-4b22-86d5-b947515e34fb	a0eded8c-af70-47ef-bb6e-8228a6d5687d	upload	pics/uploads/curvesahead.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.828297
6f5f3383-e311-47a1-8291-3eda1660494a	89c3fedf-114a-4eca-939a-68fd974aedc5	upload	pics/uploads/stop.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.833764
dbaafc54-0de4-4a20-a9a5-55ca5985e72f	cf15380e-781d-4b0d-b96a-ef77a32b0425	upload	pics/uploads/noparking.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.839062
393bd2e1-6c6f-4288-aed7-fc7b88995eb2	7080aa9d-e1e9-41ea-b020-6832436296aa	upload	pics/uploads/noright.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.844792
a1b9fad3-0ac3-47ef-bf8a-187fff104597	473ed2d0-039f-4860-b5aa-7a73d033ae09	upload	pics/uploads/nouturn.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.85339
8618dc6e-a380-4626-a8a2-07f75897c8e7	6dd15d1f-fb5f-4d70-b76c-d6f2a52c6518	upload	pics/uploads/noleft.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.859865
6785db53-29e4-482e-b4ad-b59b91c4cd7b	6b1013d2-f985-49cb-89fa-3cd90a9374f6	upload	pics/uploads/nopeople.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.864738
024f95a9-9417-481a-bdfb-3f079989564b	fde7448b-5156-4e5c-a0d7-63e0e3fc972f	upload	pics/uploads/nosign.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.870207
fbd5f915-b4b5-4d18-8a84-b342f85dda1c	8c142268-3589-404f-a90d-f2caaeb0c78c	upload	pics/uploads/speedlimit50.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.875308
4049017c-7a5a-4c07-9742-2ef3b8208595	f0e9a4ce-0a29-4650-8df0-a5acd7af652a	upload	pics/uploads/bump.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.88026
5bd097c6-1999-4a6c-a2de-42c0f9924424	982f1df6-006b-4df5-a886-17401399afe5	upload	pics/uploads/deer.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.885557
f3e68e2a-ce50-4eb8-affd-d12693c97437	a04ba9f8-705c-40b3-bd80-ed2d0e340962	upload	pics/uploads/median.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.890449
2e60907b-bafe-4645-9799-308d0600e028	e06ad079-856e-49af-ad1f-293edb02fd20	upload	pics/uploads/reversemedian.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.895928
4fa61d11-5cfb-4b24-9848-43212ad13a84	0de75c0e-0423-456b-89c9-5b71bfee4cdd	upload	pics/uploads/roadclosed.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.901172
e149ff31-68cd-4eb5-8ef2-452753a1603f	bde2fd37-31e7-4afe-b191-033397bf8369	upload	pics/uploads/intersection.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.90604
55ab7acf-35b6-4553-8e9c-d3e87afd694f	7743f81e-2279-408a-96e4-c23d2ab5f1d1	upload	pics/uploads/detour.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.910962
a696392f-ced5-42ac-bd26-81ac66e24ba4	d896b55e-e9c9-4a88-8079-8a805cb13c4e	upload	pics/uploads/carpool.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.916426
3a70db09-f77b-43c5-85df-1e0e028c66ee	c12fbd5c-db88-4627-be70-deed30473d19	upload	pics/uploads/keepright.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.92085
b9746e34-641f-4263-8242-a11e86d062f4	0084fa37-0939-497e-8cdc-f35cd0297013	upload	pics/uploads/rightaround.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.92583
bce08657-9fd4-4d85-b242-b067bacc3a25	71582997-fb70-4346-9503-cbb22063aef1	upload	pics/uploads/norightturn.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.930909
3ba15f8e-13ed-4192-ab7d-2f37350aa1a0	225b8f9a-8c98-47b8-9a4d-c40fef147d2d	upload	pics/uploads/passwithcare.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.936008
1dc1140a-5347-4084-a74a-ae0e15106cc1	ce67340c-c386-4df7-89ec-270981505438	upload	pics/uploads/reducespeed.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.940717
7c32bd43-831a-42e4-9dd2-bd25aaac7abc	2f49f368-b0aa-4811-9c19-9683edeb7804	upload	pics/uploads/donotenter.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.945513
18bc7005-5e6c-4841-a69e-652bc9395f33	18ce2b4e-2749-42ae-9330-b09c0424cc94	upload	pics/uploads/noleftturn.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.950892
db228423-4c5d-4562-bbc0-52dbee71fc84	e6af9a90-cc3d-4656-aa36-18a0b7071a7a	upload	pics/uploads/oneway.png	\N	\N	\N	\N	\N	2025-10-20 22:06:15.955836
\.


--
-- Data for Name: swarm_content_text; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.swarm_content_text (id, content_id, text_content, font_family, font_size, font_color, background_color, text_align, created_at) FROM stdin;
368d0b27-2074-495b-bd16-a3e24dc9c4ec	7ff34a18-5ca1-4cd8-96f9-6c755c8b8254	Two households both alike in dignity In fair Verona where we lay our scene From ancient grudge break to new mutiny Where civil blood makes civil hands unclean. From forth the fatal loins of these two foes - A pair of star-cross'd lovers take their life;	Geneva	32	Black	Green	\N	2025-10-20 22:06:16.408544
d4aee6ae-43c9-45d4-852d-3f9c4fe2b867	aa07f958-a001-4be3-8273-10d6790d58de	There is singularly nothing that makes a difference a difference in beginning and in the middle and in ending except that each generation has something different at which they are all looking. By this I mean so simply that anybody knows it that composition is the difference which makes each and all of them then different from other generations and this is what makes everything different otherwise they are all alike and everybody knows it because everybody says it.	Helvetica	32	#FFFF00	#000	\N	2025-10-20 22:06:16.413413
6b82beae-1ddd-4d11-914e-3c371bb84483	51ba09be-a847-4190-9c95-422694cfa33f	The computer never truly encounters logical paradox, but only the simulation of paradox in trains of cause and effect. The computer therefore does not fade away. It merely oscillates.	Quantico	18	#00FF00	#FF0000	\N	2025-10-20 22:06:16.418346
9e1fc713-34c7-4185-b651-5a696a48a4a2	629ea8fb-ca5e-4b7e-9acd-d5136766298d	Teleprompt Text here\nTeleprompt Text here\nTeleprompt Text here\nTeleprompt Text here\nTeleprompt Text here\nTeleprompt Text here\nTeleprompt Text here\nTeleprompt Text here	Quantico	32	red	blue	\N	2025-10-20 22:06:16.422807
\.


--
-- Data for Name: swarm_content_timers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.swarm_content_timers (id, content_id, duration_ms, label, created_at) FROM stdin;
3c508a3c-2ade-48e8-9045-2e05b1abc4fc	bce797d5-a6c9-40fd-8c07-2fc6646735cc	5015	5.15 second timer TEST	2025-10-20 22:06:16.428017
afa37e71-475f-4b99-b9f3-0965472c31db	f5b2cdef-62b7-489e-bec4-750fa03b64a5	90000	1.5 second timer	2025-10-20 22:06:16.43357
aad94c39-b225-4337-8032-ae3f3b19482c	ef5032d1-9fa2-4890-ab5f-e508ecaf2f2c	90000	1 min 30 secs	2025-10-20 22:06:16.438037
73ef30ef-67f1-4855-bd5b-6af956b2a4f9	ff251faa-eba7-4cde-86ba-07ab7d74a963	3000	Name your Timer here.	2025-10-20 22:06:16.44223
\.


--
-- Data for Name: swarm_member_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.swarm_member_roles (id, member_id, role_id, assigned_at, assigned_by) FROM stdin;
\.


--
-- Data for Name: swarm_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.swarm_members (id, swarm_id, nickname, joined_at, is_creator) FROM stdin;
56aec14e-5831-4b47-afad-2447503f9036	67687928-9572-48ee-a8ed-e132be91f2a6	RunnerLeader	2025-07-28 23:48:42.33828+00	t
0007bc54-a1c8-4833-9691-a6eca21381de	ec6008b2-77b2-4be6-88e1-43b9853ef594	DevLead	2025-07-28 23:48:42.340893+00	t
640eca21-8ca1-450e-a879-db760ce06917	460ba74c-70e0-4a8c-9002-b77aa6e3180b	TestUser	2025-10-20 19:00:56.340512+00	t
683a4e1a-709d-4166-8ae3-2911fdf960ba	460ba74c-70e0-4a8c-9002-b77aa6e3180b	JohnDoe	2025-10-20 19:01:08.512549+00	f
7d175e6c-7e85-4b57-a915-05f98f905704	67687928-9572-48ee-a8ed-e132be91f2a6	JaneRunner	2025-10-20 19:01:19.380781+00	f
7da46495-ca94-4db8-ae61-8ba79589dd53	3072bd2f-94df-44c1-8a6a-a2f191356b66	TestBot	2025-10-20 19:23:02.895021+00	t
7362affd-6a1f-4674-9a71-28f0094be640	3072bd2f-94df-44c1-8a6a-a2f191356b66	asdf	2025-10-20 20:26:40.367352+00	f
\.


--
-- Data for Name: swarm_message_targets_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.swarm_message_targets_members (message_id, member_id) FROM stdin;
\.


--
-- Data for Name: swarm_message_targets_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.swarm_message_targets_roles (message_id, role_id) FROM stdin;
\.


--
-- Data for Name: swarm_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.swarm_messages (id, swarm_id, sender_id, type, content_id, text_content, target_all, sent_at) FROM stdin;
\.


--
-- Data for Name: swarm_preset_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.swarm_preset_items (id, preset_id, content_id, sequence_order, delay_ms) FROM stdin;
\.


--
-- Data for Name: swarm_presets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.swarm_presets (id, swarm_id, name, description, created_by, created_at) FROM stdin;
\.


--
-- Data for Name: swarm_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.swarm_roles (id, swarm_id, name, description, can_send_audio, can_receive_audio, can_send_text, can_receive_text, can_send_images, can_receive_images, can_view_members, can_view_activity_log, can_schedule_content, can_manage_roles, show_menu, show_title, color, icon, created_at, updated_at) FROM stdin;
97923675-25d0-4c7d-8e9e-917fb92c1ac0	4cd33b1b-898b-477d-bb01-23bc7a81b41f	Conductor	Full control over performance	t	t	t	t	t	t	t	t	t	t	t	t	#FF6B6B	conductor	2025-10-20 22:06:15.548721	2025-10-20 22:06:15.548721
8b190421-a897-4432-bd4d-595e873179f7	4cd33b1b-898b-477d-bb01-23bc7a81b41f	Performer	Receives instructions and audio cues	f	t	f	t	f	t	t	f	f	f	t	t	#667EEA	user	2025-10-20 22:06:15.548721	2025-10-20 22:06:15.548721
941ff600-2075-41ef-aec1-705bc99a52da	4cd33b1b-898b-477d-bb01-23bc7a81b41f	Lead	Lead performer with communication ability	t	t	t	t	f	t	t	t	f	f	t	t	#2ECC71	star	2025-10-20 22:06:15.548721	2025-10-20 22:06:15.548721
d1b3f3cc-d89f-478d-a2a6-17a1d85abe2b	4cd33b1b-898b-477d-bb01-23bc7a81b41f	Prompter	full control: the only performer allowed to transmit.	t	t	t	t	t	t	t	t	f	f	t	t	\N	\N	2025-10-20 22:06:15.560669	2025-10-20 22:06:15.560669
5a8164af-da55-4eb9-a898-d0751ec53dea	4cd33b1b-898b-477d-bb01-23bc7a81b41f	Receiver	no control: can only receive.	t	t	t	t	t	t	t	t	f	f	t	t	\N	\N	2025-10-20 22:06:15.564112	2025-10-20 22:06:15.564112
a062c29e-7d59-4c67-863f-6783c298c23a	4cd33b1b-898b-477d-bb01-23bc7a81b41f	Chorus	Plays a collective supporting role.	f	t	f	f	f	t	f	f	f	f	f	f	\N	\N	2025-10-20 22:06:15.578737	2025-10-20 22:06:15.578737
9af499b9-466f-4670-8365-26440b6721c6	4cd33b1b-898b-477d-bb01-23bc7a81b41f	Team	Group of Performers in Unison	t	t	t	t	t	t	t	t	f	f	t	t	\N	\N	2025-10-20 22:06:15.585027	2025-10-20 22:06:15.585027
e0f1da8a-a734-4904-97b9-dc3324a2bdeb	4cd33b1b-898b-477d-bb01-23bc7a81b41f	Chord Conductor	Roles organize possible performance functions, allowing each performer to have their functions and interface layout to be determined in advance. Multiple performers can play the same role in a performance. The function checkboxes determine the access to data, interface layout, and capability to send and/or receive.	f	t	f	f	f	t	f	t	f	f	t	t	\N	\N	2025-10-20 22:06:15.588808	2025-10-20 22:06:15.588808
cc6c1c5b-6b92-437f-921d-86a5b52417e4	4cd33b1b-898b-477d-bb01-23bc7a81b41f	PINK	Roles organize possible performance functions, allowing each performer to have their functions and interface layout to be determined in advance. Multiple performers can play the same role in a performance. The function checkboxes determine the access to data, interface layout, and capability to send and/or receive.	f	t	f	t	f	f	f	f	f	f	f	f	\N	\N	2025-10-20 22:06:15.591926	2025-10-20 22:06:15.591926
2f85ef70-6476-4f55-884e-d594a7d61067	4cd33b1b-898b-477d-bb01-23bc7a81b41f	ORANGE	Roles organize possible performance functions, allowing each performer to have their functions and interface layout to be determined in advance. Multiple performers can play the same role in a performance. The function checkboxes determine the access to data, interface layout, and capability to send and/or receive.	f	t	f	t	f	f	f	f	f	f	f	f	\N	\N	2025-10-20 22:06:15.595079	2025-10-20 22:06:15.595079
942523dd-30ab-472e-a497-9e59afa3a462	4cd33b1b-898b-477d-bb01-23bc7a81b41f	GREEN	Roles organize possible performance functions, allowing each performer to have their functions and interface layout to be determined in advance. Multiple performers can play the same role in a performance. The function checkboxes determine the access to data, interface layout, and capability to send and/or receive.	f	t	f	t	f	f	f	f	f	f	f	f	\N	\N	2025-10-20 22:06:15.598012	2025-10-20 22:06:15.598012
f074426e-ee88-4248-9d34-7544934ae597	4cd33b1b-898b-477d-bb01-23bc7a81b41f	YELLOW	Roles organize possible performance functions, allowing each performer to have their functions and interface layout to be determined in advance. Multiple performers can play the same role in a performance. The function checkboxes determine the access to data, interface layout, and capability to send and/or receive.	f	t	f	t	f	f	f	f	f	f	f	f	\N	\N	2025-10-20 22:06:15.601172	2025-10-20 22:06:15.601172
618e18b5-ff46-4572-9099-3479cf427f6b	4cd33b1b-898b-477d-bb01-23bc7a81b41f	CALLER OF THE DANCE	Roles organize possible performance functions, allowing each performer to have their functions and interface layout to be determined in advance. Multiple performers can play the same role in a performance. The function checkboxes determine the access to data, interface layout, and capability to send and/or receive.	f	f	f	f	f	f	t	t	f	f	t	f	\N	\N	2025-10-20 22:06:15.604072	2025-10-20 22:06:15.604072
\.


--
-- Data for Name: swarm_scheduled_event_targets_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.swarm_scheduled_event_targets_members (event_id, member_id) FROM stdin;
\.


--
-- Data for Name: swarm_scheduled_event_targets_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.swarm_scheduled_event_targets_roles (event_id, role_id) FROM stdin;
\.


--
-- Data for Name: swarm_scheduled_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.swarm_scheduled_events (id, swarm_id, content_id, scheduled_time, status, target_all, created_by, created_at, sent_at) FROM stdin;
\.


--
-- Data for Name: swarms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.swarms (id, name, description, privacy, category, invite_code, created_at, updated_at) FROM stdin;
67687928-9572-48ee-a8ed-e132be91f2a6	Morning Joggers	Daily morning jog group for fitness enthusiasts	public	social	JOGGING123	2025-07-28 23:48:42.335761+00	2025-07-28 23:48:42.335761+00
ec6008b2-77b2-4be6-88e1-43b9853ef594	Dev Team Alpha	Sprint planning and coordination for our development team	private	work	DEVTEAM456	2025-07-28 23:48:42.335761+00	2025-07-28 23:48:42.335761+00
bc0e62a4-d6e0-4ef1-a612-b0b9ce705ade	Book Club Readers	Monthly book discussions and recommendations	public	social	BOOKS789	2025-07-28 23:48:42.335761+00	2025-07-28 23:48:42.335761+00
460ba74c-70e0-4a8c-9002-b77aa6e3180b	Test Swarm Local	Testing locally created swarm	public	social	SECAU8	2025-10-20 19:00:56.336954+00	2025-10-20 19:00:56.336954+00
3072bd2f-94df-44c1-8a6a-a2f191356b66	Browser Test Swarm	Open http://localhost:3333/swarms to see me!	public	social	7XLHV6	2025-10-20 19:23:02.882357+00	2025-10-20 19:23:02.882357+00
4cd33b1b-898b-477d-bb01-23bc7a81b41f	Telebrain Demo	Migrated data from original Telebrain	public	event	TELEBRAIN	2025-10-20 22:06:15.548721+00	2025-10-20 22:06:15.548721+00
\.


--
-- Name: swarm_activity_log swarm_activity_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_activity_log
    ADD CONSTRAINT swarm_activity_log_pkey PRIMARY KEY (id);


--
-- Name: swarm_content_audio swarm_content_audio_content_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_content_audio
    ADD CONSTRAINT swarm_content_audio_content_id_key UNIQUE (content_id);


--
-- Name: swarm_content_audio swarm_content_audio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_content_audio
    ADD CONSTRAINT swarm_content_audio_pkey PRIMARY KEY (id);


--
-- Name: swarm_content_images swarm_content_images_content_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_content_images
    ADD CONSTRAINT swarm_content_images_content_id_key UNIQUE (content_id);


--
-- Name: swarm_content_images swarm_content_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_content_images
    ADD CONSTRAINT swarm_content_images_pkey PRIMARY KEY (id);


--
-- Name: swarm_content swarm_content_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_content
    ADD CONSTRAINT swarm_content_pkey PRIMARY KEY (id);


--
-- Name: swarm_content_text swarm_content_text_content_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_content_text
    ADD CONSTRAINT swarm_content_text_content_id_key UNIQUE (content_id);


--
-- Name: swarm_content_text swarm_content_text_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_content_text
    ADD CONSTRAINT swarm_content_text_pkey PRIMARY KEY (id);


--
-- Name: swarm_content_timers swarm_content_timers_content_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_content_timers
    ADD CONSTRAINT swarm_content_timers_content_id_key UNIQUE (content_id);


--
-- Name: swarm_content_timers swarm_content_timers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_content_timers
    ADD CONSTRAINT swarm_content_timers_pkey PRIMARY KEY (id);


--
-- Name: swarm_member_roles swarm_member_roles_member_id_role_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_member_roles
    ADD CONSTRAINT swarm_member_roles_member_id_role_id_key UNIQUE (member_id, role_id);


--
-- Name: swarm_member_roles swarm_member_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_member_roles
    ADD CONSTRAINT swarm_member_roles_pkey PRIMARY KEY (id);


--
-- Name: swarm_members swarm_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_members
    ADD CONSTRAINT swarm_members_pkey PRIMARY KEY (id);


--
-- Name: swarm_members swarm_members_swarm_id_nickname_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_members
    ADD CONSTRAINT swarm_members_swarm_id_nickname_key UNIQUE (swarm_id, nickname);


--
-- Name: swarm_message_targets_members swarm_message_targets_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_message_targets_members
    ADD CONSTRAINT swarm_message_targets_members_pkey PRIMARY KEY (message_id, member_id);


--
-- Name: swarm_message_targets_roles swarm_message_targets_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_message_targets_roles
    ADD CONSTRAINT swarm_message_targets_roles_pkey PRIMARY KEY (message_id, role_id);


--
-- Name: swarm_messages swarm_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_messages
    ADD CONSTRAINT swarm_messages_pkey PRIMARY KEY (id);


--
-- Name: swarm_preset_items swarm_preset_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_preset_items
    ADD CONSTRAINT swarm_preset_items_pkey PRIMARY KEY (id);


--
-- Name: swarm_preset_items swarm_preset_items_preset_id_sequence_order_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_preset_items
    ADD CONSTRAINT swarm_preset_items_preset_id_sequence_order_key UNIQUE (preset_id, sequence_order);


--
-- Name: swarm_presets swarm_presets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_presets
    ADD CONSTRAINT swarm_presets_pkey PRIMARY KEY (id);


--
-- Name: swarm_roles swarm_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_roles
    ADD CONSTRAINT swarm_roles_pkey PRIMARY KEY (id);


--
-- Name: swarm_roles swarm_roles_swarm_id_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_roles
    ADD CONSTRAINT swarm_roles_swarm_id_name_key UNIQUE (swarm_id, name);


--
-- Name: swarm_scheduled_event_targets_members swarm_scheduled_event_targets_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_scheduled_event_targets_members
    ADD CONSTRAINT swarm_scheduled_event_targets_members_pkey PRIMARY KEY (event_id, member_id);


--
-- Name: swarm_scheduled_event_targets_roles swarm_scheduled_event_targets_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_scheduled_event_targets_roles
    ADD CONSTRAINT swarm_scheduled_event_targets_roles_pkey PRIMARY KEY (event_id, role_id);


--
-- Name: swarm_scheduled_events swarm_scheduled_events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_scheduled_events
    ADD CONSTRAINT swarm_scheduled_events_pkey PRIMARY KEY (id);


--
-- Name: swarms swarms_invite_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarms
    ADD CONSTRAINT swarms_invite_code_key UNIQUE (invite_code);


--
-- Name: swarms swarms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarms
    ADD CONSTRAINT swarms_pkey PRIMARY KEY (id);


--
-- Name: idx_activity_action; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activity_action ON public.swarm_activity_log USING btree (swarm_id, action);


--
-- Name: idx_activity_member; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activity_member ON public.swarm_activity_log USING btree (member_id);


--
-- Name: idx_activity_swarm; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_activity_swarm ON public.swarm_activity_log USING btree (swarm_id, created_at DESC);


--
-- Name: idx_audio_content; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audio_content ON public.swarm_content_audio USING btree (content_id);


--
-- Name: idx_content_creator; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_creator ON public.swarm_content USING btree (created_by);


--
-- Name: idx_content_swarm; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_swarm ON public.swarm_content USING btree (swarm_id);


--
-- Name: idx_content_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_content_type ON public.swarm_content USING btree (swarm_id, type);


--
-- Name: idx_member_roles_member; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_member_roles_member ON public.swarm_member_roles USING btree (member_id);


--
-- Name: idx_member_roles_role; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_member_roles_role ON public.swarm_member_roles USING btree (role_id);


--
-- Name: idx_messages_sender; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_sender ON public.swarm_messages USING btree (sender_id);


--
-- Name: idx_messages_swarm; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_messages_swarm ON public.swarm_messages USING btree (swarm_id, sent_at DESC);


--
-- Name: idx_msg_targets_members; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_msg_targets_members ON public.swarm_message_targets_members USING btree (message_id);


--
-- Name: idx_msg_targets_roles; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_msg_targets_roles ON public.swarm_message_targets_roles USING btree (message_id);


--
-- Name: idx_preset_items; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_preset_items ON public.swarm_preset_items USING btree (preset_id, sequence_order);


--
-- Name: idx_scheduled_events_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_scheduled_events_time ON public.swarm_scheduled_events USING btree (swarm_id, scheduled_time) WHERE (status = 'pending'::public.event_status);


--
-- Name: idx_swarm_members_swarm_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_swarm_members_swarm_id ON public.swarm_members USING btree (swarm_id);


--
-- Name: idx_swarm_roles_swarm_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_swarm_roles_swarm_id ON public.swarm_roles USING btree (swarm_id);


--
-- Name: idx_swarms_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_swarms_category ON public.swarms USING btree (category);


--
-- Name: idx_swarms_invite_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_swarms_invite_code ON public.swarms USING btree (invite_code);


--
-- Name: idx_swarms_privacy; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_swarms_privacy ON public.swarms USING btree (privacy);


--
-- Name: swarm_member_roles after_member_role_change; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER after_member_role_change AFTER INSERT OR DELETE ON public.swarm_member_roles FOR EACH ROW EXECUTE FUNCTION public.trigger_log_role_assignment();


--
-- Name: swarms after_swarm_insert_create_roles; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER after_swarm_insert_create_roles AFTER INSERT ON public.swarms FOR EACH ROW EXECUTE FUNCTION public.trigger_create_default_roles();


--
-- Name: swarm_activity_log swarm_activity_log_content_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_activity_log
    ADD CONSTRAINT swarm_activity_log_content_id_fkey FOREIGN KEY (content_id) REFERENCES public.swarm_content(id) ON DELETE SET NULL;


--
-- Name: swarm_activity_log swarm_activity_log_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_activity_log
    ADD CONSTRAINT swarm_activity_log_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.swarm_members(id) ON DELETE SET NULL;


--
-- Name: swarm_activity_log swarm_activity_log_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_activity_log
    ADD CONSTRAINT swarm_activity_log_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.swarm_roles(id) ON DELETE SET NULL;


--
-- Name: swarm_activity_log swarm_activity_log_swarm_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_activity_log
    ADD CONSTRAINT swarm_activity_log_swarm_id_fkey FOREIGN KEY (swarm_id) REFERENCES public.swarms(id) ON DELETE CASCADE;


--
-- Name: swarm_activity_log swarm_activity_log_target_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_activity_log
    ADD CONSTRAINT swarm_activity_log_target_member_id_fkey FOREIGN KEY (target_member_id) REFERENCES public.swarm_members(id) ON DELETE SET NULL;


--
-- Name: swarm_content_audio swarm_content_audio_content_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_content_audio
    ADD CONSTRAINT swarm_content_audio_content_id_fkey FOREIGN KEY (content_id) REFERENCES public.swarm_content(id) ON DELETE CASCADE;


--
-- Name: swarm_content swarm_content_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_content
    ADD CONSTRAINT swarm_content_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.swarm_members(id);


--
-- Name: swarm_content_images swarm_content_images_content_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_content_images
    ADD CONSTRAINT swarm_content_images_content_id_fkey FOREIGN KEY (content_id) REFERENCES public.swarm_content(id) ON DELETE CASCADE;


--
-- Name: swarm_content swarm_content_swarm_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_content
    ADD CONSTRAINT swarm_content_swarm_id_fkey FOREIGN KEY (swarm_id) REFERENCES public.swarms(id) ON DELETE CASCADE;


--
-- Name: swarm_content_text swarm_content_text_content_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_content_text
    ADD CONSTRAINT swarm_content_text_content_id_fkey FOREIGN KEY (content_id) REFERENCES public.swarm_content(id) ON DELETE CASCADE;


--
-- Name: swarm_content_timers swarm_content_timers_content_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_content_timers
    ADD CONSTRAINT swarm_content_timers_content_id_fkey FOREIGN KEY (content_id) REFERENCES public.swarm_content(id) ON DELETE CASCADE;


--
-- Name: swarm_member_roles swarm_member_roles_assigned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_member_roles
    ADD CONSTRAINT swarm_member_roles_assigned_by_fkey FOREIGN KEY (assigned_by) REFERENCES public.swarm_members(id);


--
-- Name: swarm_member_roles swarm_member_roles_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_member_roles
    ADD CONSTRAINT swarm_member_roles_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.swarm_members(id) ON DELETE CASCADE;


--
-- Name: swarm_member_roles swarm_member_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_member_roles
    ADD CONSTRAINT swarm_member_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.swarm_roles(id) ON DELETE CASCADE;


--
-- Name: swarm_members swarm_members_swarm_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_members
    ADD CONSTRAINT swarm_members_swarm_id_fkey FOREIGN KEY (swarm_id) REFERENCES public.swarms(id) ON DELETE CASCADE;


--
-- Name: swarm_message_targets_members swarm_message_targets_members_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_message_targets_members
    ADD CONSTRAINT swarm_message_targets_members_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.swarm_members(id) ON DELETE CASCADE;


--
-- Name: swarm_message_targets_members swarm_message_targets_members_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_message_targets_members
    ADD CONSTRAINT swarm_message_targets_members_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.swarm_messages(id) ON DELETE CASCADE;


--
-- Name: swarm_message_targets_roles swarm_message_targets_roles_message_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_message_targets_roles
    ADD CONSTRAINT swarm_message_targets_roles_message_id_fkey FOREIGN KEY (message_id) REFERENCES public.swarm_messages(id) ON DELETE CASCADE;


--
-- Name: swarm_message_targets_roles swarm_message_targets_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_message_targets_roles
    ADD CONSTRAINT swarm_message_targets_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.swarm_roles(id) ON DELETE CASCADE;


--
-- Name: swarm_messages swarm_messages_content_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_messages
    ADD CONSTRAINT swarm_messages_content_id_fkey FOREIGN KEY (content_id) REFERENCES public.swarm_content(id) ON DELETE SET NULL;


--
-- Name: swarm_messages swarm_messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_messages
    ADD CONSTRAINT swarm_messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.swarm_members(id) ON DELETE SET NULL;


--
-- Name: swarm_messages swarm_messages_swarm_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_messages
    ADD CONSTRAINT swarm_messages_swarm_id_fkey FOREIGN KEY (swarm_id) REFERENCES public.swarms(id) ON DELETE CASCADE;


--
-- Name: swarm_preset_items swarm_preset_items_content_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_preset_items
    ADD CONSTRAINT swarm_preset_items_content_id_fkey FOREIGN KEY (content_id) REFERENCES public.swarm_content(id) ON DELETE CASCADE;


--
-- Name: swarm_preset_items swarm_preset_items_preset_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_preset_items
    ADD CONSTRAINT swarm_preset_items_preset_id_fkey FOREIGN KEY (preset_id) REFERENCES public.swarm_presets(id) ON DELETE CASCADE;


--
-- Name: swarm_presets swarm_presets_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_presets
    ADD CONSTRAINT swarm_presets_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.swarm_members(id);


--
-- Name: swarm_presets swarm_presets_swarm_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_presets
    ADD CONSTRAINT swarm_presets_swarm_id_fkey FOREIGN KEY (swarm_id) REFERENCES public.swarms(id) ON DELETE CASCADE;


--
-- Name: swarm_roles swarm_roles_swarm_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_roles
    ADD CONSTRAINT swarm_roles_swarm_id_fkey FOREIGN KEY (swarm_id) REFERENCES public.swarms(id) ON DELETE CASCADE;


--
-- Name: swarm_scheduled_event_targets_members swarm_scheduled_event_targets_members_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_scheduled_event_targets_members
    ADD CONSTRAINT swarm_scheduled_event_targets_members_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.swarm_scheduled_events(id) ON DELETE CASCADE;


--
-- Name: swarm_scheduled_event_targets_members swarm_scheduled_event_targets_members_member_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_scheduled_event_targets_members
    ADD CONSTRAINT swarm_scheduled_event_targets_members_member_id_fkey FOREIGN KEY (member_id) REFERENCES public.swarm_members(id) ON DELETE CASCADE;


--
-- Name: swarm_scheduled_event_targets_roles swarm_scheduled_event_targets_roles_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_scheduled_event_targets_roles
    ADD CONSTRAINT swarm_scheduled_event_targets_roles_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.swarm_scheduled_events(id) ON DELETE CASCADE;


--
-- Name: swarm_scheduled_event_targets_roles swarm_scheduled_event_targets_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_scheduled_event_targets_roles
    ADD CONSTRAINT swarm_scheduled_event_targets_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.swarm_roles(id) ON DELETE CASCADE;


--
-- Name: swarm_scheduled_events swarm_scheduled_events_content_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_scheduled_events
    ADD CONSTRAINT swarm_scheduled_events_content_id_fkey FOREIGN KEY (content_id) REFERENCES public.swarm_content(id) ON DELETE CASCADE;


--
-- Name: swarm_scheduled_events swarm_scheduled_events_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_scheduled_events
    ADD CONSTRAINT swarm_scheduled_events_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.swarm_members(id);


--
-- Name: swarm_scheduled_events swarm_scheduled_events_swarm_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.swarm_scheduled_events
    ADD CONSTRAINT swarm_scheduled_events_swarm_id_fkey FOREIGN KEY (swarm_id) REFERENCES public.swarms(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

