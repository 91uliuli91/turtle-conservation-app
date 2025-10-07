--
-- PostgreSQL database dump
--

\restrict oKQnfUzV7pE7x3kS8N3jW2kTfFEbDOHi7zztzYqhOmfXwfSROYN90cpJeV9UJZQ

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: campamentos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.campamentos (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL
);


ALTER TABLE public.campamentos OWNER TO postgres;

--
-- Name: campamentos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.campamentos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.campamentos_id_seq OWNER TO postgres;

--
-- Name: campamentos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.campamentos_id_seq OWNED BY public.campamentos.id;


--
-- Name: condiciones_ambientales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.condiciones_ambientales (
    id integer NOT NULL,
    evento_id integer NOT NULL,
    temperatura_arena_nido_c numeric(5,2),
    humedad_arena_porcentaje numeric(5,2),
    fase_lunar character varying(50)
);


ALTER TABLE public.condiciones_ambientales OWNER TO postgres;

--
-- Name: condiciones_ambientales_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.condiciones_ambientales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.condiciones_ambientales_id_seq OWNER TO postgres;

--
-- Name: condiciones_ambientales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.condiciones_ambientales_id_seq OWNED BY public.condiciones_ambientales.id;


--
-- Name: especies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.especies (
    id integer NOT NULL,
    nombre_comun character varying(100) NOT NULL,
    nombre_cientifico character varying(100)
);


ALTER TABLE public.especies OWNER TO postgres;

--
-- Name: especies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.especies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.especies_id_seq OWNER TO postgres;

--
-- Name: especies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.especies_id_seq OWNED BY public.especies.id;


--
-- Name: estado_zona; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estado_zona (
    id integer NOT NULL,
    descripcion character varying(100) NOT NULL
);


ALTER TABLE public.estado_zona OWNER TO postgres;

--
-- Name: estado_zona_evento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estado_zona_evento (
    id integer NOT NULL,
    evento_id integer NOT NULL,
    estado_zona_id integer NOT NULL,
    descripcion_adicional text
);


ALTER TABLE public.estado_zona_evento OWNER TO postgres;

--
-- Name: estado_zona_evento_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.estado_zona_evento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.estado_zona_evento_id_seq OWNER TO postgres;

--
-- Name: estado_zona_evento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estado_zona_evento_id_seq OWNED BY public.estado_zona_evento.id;


--
-- Name: estado_zona_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.estado_zona_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.estado_zona_id_seq OWNER TO postgres;

--
-- Name: estado_zona_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estado_zona_id_seq OWNED BY public.estado_zona.id;


--
-- Name: eventos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.eventos (
    id integer NOT NULL,
    tipo_evento character varying(50) NOT NULL,
    fecha_hora timestamp with time zone NOT NULL,
    campamento_id integer,
    zona_playa character varying(1),
    estacion_baliza character varying(50),
    coordenada_lat numeric(10,8),
    coordenada_lon numeric(11,8),
    tortuga_id integer,
    personal_registro_id integer,
    observaciones text,
    CONSTRAINT eventos_tipo_evento_check CHECK (((tipo_evento)::text = ANY ((ARRAY['Anidaci├│n'::character varying, 'Intento'::character varying, 'Arqueo'::character varying])::text[]))),
    CONSTRAINT eventos_zona_playa_check CHECK (((zona_playa)::text = ANY ((ARRAY['A'::character varying, 'B'::character varying, 'C'::character varying])::text[])))
);


ALTER TABLE public.eventos OWNER TO postgres;

--
-- Name: eventos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.eventos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.eventos_id_seq OWNER TO postgres;

--
-- Name: eventos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.eventos_id_seq OWNED BY public.eventos.id;


--
-- Name: exhumaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exhumaciones (
    id integer NOT NULL,
    nido_id integer NOT NULL,
    fecha_hora_exhumacion timestamp with time zone NOT NULL,
    crias_vivas_liberadas integer DEFAULT 0,
    crias_muertas_en_nido integer DEFAULT 0,
    crias_deformes integer DEFAULT 0,
    huevos_no_eclosionados integer DEFAULT 0,
    comentarios text
);


ALTER TABLE public.exhumaciones OWNER TO postgres;

--
-- Name: exhumaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.exhumaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.exhumaciones_id_seq OWNER TO postgres;

--
-- Name: exhumaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.exhumaciones_id_seq OWNED BY public.exhumaciones.id;


--
-- Name: nidos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nidos (
    id integer NOT NULL,
    evento_anidacion_id integer NOT NULL,
    numero_huevos_recolectados integer NOT NULL,
    trasladado_a_corral boolean DEFAULT false,
    fecha_hora_traslado timestamp with time zone,
    identificador_en_corral character varying(100),
    fecha_probable_eclosion date,
    temperatura_media_corral_c numeric(5,2),
    humedad_media_corral_porcentaje numeric(5,2),
    observaciones_corral text
);


ALTER TABLE public.nidos OWNER TO postgres;

--
-- Name: nidos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nidos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nidos_id_seq OWNER TO postgres;

--
-- Name: nidos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nidos_id_seq OWNED BY public.nidos.id;


--
-- Name: observaciones_tortuga; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.observaciones_tortuga (
    id integer NOT NULL,
    evento_id integer NOT NULL,
    largo_caparazon_cm numeric(5,2),
    ancho_caparazon_cm numeric(5,2),
    se_coloco_marca_nueva boolean DEFAULT false,
    se_remarco boolean DEFAULT false,
    path_fotos text
);


ALTER TABLE public.observaciones_tortuga OWNER TO postgres;

--
-- Name: observaciones_tortuga_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.observaciones_tortuga_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.observaciones_tortuga_id_seq OWNER TO postgres;

--
-- Name: observaciones_tortuga_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.observaciones_tortuga_id_seq OWNED BY public.observaciones_tortuga.id;


--
-- Name: personal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.personal (
    id integer NOT NULL,
    nombre_completo character varying(150) NOT NULL,
    rol character varying(50)
);


ALTER TABLE public.personal OWNER TO postgres;

--
-- Name: personal_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.personal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.personal_id_seq OWNER TO postgres;

--
-- Name: personal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.personal_id_seq OWNED BY public.personal.id;


--
-- Name: tortugas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tortugas (
    id integer NOT NULL,
    marca_principal character varying(50),
    especie_id integer
);


ALTER TABLE public.tortugas OWNER TO postgres;

--
-- Name: tortugas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tortugas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tortugas_id_seq OWNER TO postgres;

--
-- Name: tortugas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tortugas_id_seq OWNED BY public.tortugas.id;


--
-- Name: campamentos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campamentos ALTER COLUMN id SET DEFAULT nextval('public.campamentos_id_seq'::regclass);


--
-- Name: condiciones_ambientales id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condiciones_ambientales ALTER COLUMN id SET DEFAULT nextval('public.condiciones_ambientales_id_seq'::regclass);


--
-- Name: especies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.especies ALTER COLUMN id SET DEFAULT nextval('public.especies_id_seq'::regclass);


--
-- Name: estado_zona id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_zona ALTER COLUMN id SET DEFAULT nextval('public.estado_zona_id_seq'::regclass);


--
-- Name: estado_zona_evento id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_zona_evento ALTER COLUMN id SET DEFAULT nextval('public.estado_zona_evento_id_seq'::regclass);


--
-- Name: eventos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventos ALTER COLUMN id SET DEFAULT nextval('public.eventos_id_seq'::regclass);


--
-- Name: exhumaciones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exhumaciones ALTER COLUMN id SET DEFAULT nextval('public.exhumaciones_id_seq'::regclass);


--
-- Name: nidos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nidos ALTER COLUMN id SET DEFAULT nextval('public.nidos_id_seq'::regclass);


--
-- Name: observaciones_tortuga id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_tortuga ALTER COLUMN id SET DEFAULT nextval('public.observaciones_tortuga_id_seq'::regclass);


--
-- Name: personal id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal ALTER COLUMN id SET DEFAULT nextval('public.personal_id_seq'::regclass);


--
-- Name: tortugas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tortugas ALTER COLUMN id SET DEFAULT nextval('public.tortugas_id_seq'::regclass);


--
-- Data for Name: campamentos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.campamentos (id, nombre) FROM stdin;
\.


--
-- Data for Name: condiciones_ambientales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.condiciones_ambientales (id, evento_id, temperatura_arena_nido_c, humedad_arena_porcentaje, fase_lunar) FROM stdin;
\.


--
-- Data for Name: especies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.especies (id, nombre_comun, nombre_cientifico) FROM stdin;
1	caguama	Cc
2	blanca	Cm
\.


--
-- Data for Name: estado_zona; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estado_zona (id, descripcion) FROM stdin;
1	Inundado
2	Rocas
3	Vegetaci├│n
4	Basura
5	Camastros
6	Normal
7	Talud
8	Compactado
9	Hu├®spedes
10	Derrumbe
11	Otros
\.


--
-- Data for Name: estado_zona_evento; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estado_zona_evento (id, evento_id, estado_zona_id, descripcion_adicional) FROM stdin;
\.


--
-- Data for Name: eventos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.eventos (id, tipo_evento, fecha_hora, campamento_id, zona_playa, estacion_baliza, coordenada_lat, coordenada_lon, tortuga_id, personal_registro_id, observaciones) FROM stdin;
\.


--
-- Data for Name: exhumaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exhumaciones (id, nido_id, fecha_hora_exhumacion, crias_vivas_liberadas, crias_muertas_en_nido, crias_deformes, huevos_no_eclosionados, comentarios) FROM stdin;
\.


--
-- Data for Name: nidos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nidos (id, evento_anidacion_id, numero_huevos_recolectados, trasladado_a_corral, fecha_hora_traslado, identificador_en_corral, fecha_probable_eclosion, temperatura_media_corral_c, humedad_media_corral_porcentaje, observaciones_corral) FROM stdin;
\.


--
-- Data for Name: observaciones_tortuga; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.observaciones_tortuga (id, evento_id, largo_caparazon_cm, ancho_caparazon_cm, se_coloco_marca_nueva, se_remarco, path_fotos) FROM stdin;
\.


--
-- Data for Name: personal; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.personal (id, nombre_completo, rol) FROM stdin;
\.


--
-- Data for Name: tortugas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tortugas (id, marca_principal, especie_id) FROM stdin;
\.


--
-- Name: campamentos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.campamentos_id_seq', 1, false);


--
-- Name: condiciones_ambientales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.condiciones_ambientales_id_seq', 1, false);


--
-- Name: especies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.especies_id_seq', 2, true);


--
-- Name: estado_zona_evento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estado_zona_evento_id_seq', 1, false);


--
-- Name: estado_zona_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estado_zona_id_seq', 11, true);


--
-- Name: eventos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.eventos_id_seq', 1, false);


--
-- Name: exhumaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exhumaciones_id_seq', 1, false);


--
-- Name: nidos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nidos_id_seq', 1, false);


--
-- Name: observaciones_tortuga_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.observaciones_tortuga_id_seq', 1, false);


--
-- Name: personal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.personal_id_seq', 1, false);


--
-- Name: tortugas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tortugas_id_seq', 1, false);


--
-- Name: campamentos campamentos_nombre_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campamentos
    ADD CONSTRAINT campamentos_nombre_key UNIQUE (nombre);


--
-- Name: campamentos campamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campamentos
    ADD CONSTRAINT campamentos_pkey PRIMARY KEY (id);


--
-- Name: condiciones_ambientales condiciones_ambientales_evento_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condiciones_ambientales
    ADD CONSTRAINT condiciones_ambientales_evento_id_key UNIQUE (evento_id);


--
-- Name: condiciones_ambientales condiciones_ambientales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condiciones_ambientales
    ADD CONSTRAINT condiciones_ambientales_pkey PRIMARY KEY (id);


--
-- Name: especies especies_nombre_cientifico_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.especies
    ADD CONSTRAINT especies_nombre_cientifico_key UNIQUE (nombre_cientifico);


--
-- Name: especies especies_nombre_comun_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.especies
    ADD CONSTRAINT especies_nombre_comun_key UNIQUE (nombre_comun);


--
-- Name: especies especies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.especies
    ADD CONSTRAINT especies_pkey PRIMARY KEY (id);


--
-- Name: estado_zona estado_zona_descripcion_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_zona
    ADD CONSTRAINT estado_zona_descripcion_key UNIQUE (descripcion);


--
-- Name: estado_zona_evento estado_zona_evento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_zona_evento
    ADD CONSTRAINT estado_zona_evento_pkey PRIMARY KEY (id);


--
-- Name: estado_zona estado_zona_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_zona
    ADD CONSTRAINT estado_zona_pkey PRIMARY KEY (id);


--
-- Name: eventos eventos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventos
    ADD CONSTRAINT eventos_pkey PRIMARY KEY (id);


--
-- Name: exhumaciones exhumaciones_nido_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exhumaciones
    ADD CONSTRAINT exhumaciones_nido_id_key UNIQUE (nido_id);


--
-- Name: exhumaciones exhumaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exhumaciones
    ADD CONSTRAINT exhumaciones_pkey PRIMARY KEY (id);


--
-- Name: nidos nidos_evento_anidacion_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nidos
    ADD CONSTRAINT nidos_evento_anidacion_id_key UNIQUE (evento_anidacion_id);


--
-- Name: nidos nidos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nidos
    ADD CONSTRAINT nidos_pkey PRIMARY KEY (id);


--
-- Name: observaciones_tortuga observaciones_tortuga_evento_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_tortuga
    ADD CONSTRAINT observaciones_tortuga_evento_id_key UNIQUE (evento_id);


--
-- Name: observaciones_tortuga observaciones_tortuga_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_tortuga
    ADD CONSTRAINT observaciones_tortuga_pkey PRIMARY KEY (id);


--
-- Name: personal personal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal
    ADD CONSTRAINT personal_pkey PRIMARY KEY (id);


--
-- Name: tortugas tortugas_marca_principal_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tortugas
    ADD CONSTRAINT tortugas_marca_principal_key UNIQUE (marca_principal);


--
-- Name: tortugas tortugas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tortugas
    ADD CONSTRAINT tortugas_pkey PRIMARY KEY (id);


--
-- Name: condiciones_ambientales condiciones_ambientales_evento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condiciones_ambientales
    ADD CONSTRAINT condiciones_ambientales_evento_id_fkey FOREIGN KEY (evento_id) REFERENCES public.eventos(id) ON DELETE CASCADE;


--
-- Name: estado_zona_evento estado_zona_evento_estado_zona_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_zona_evento
    ADD CONSTRAINT estado_zona_evento_estado_zona_id_fkey FOREIGN KEY (estado_zona_id) REFERENCES public.estado_zona(id);


--
-- Name: estado_zona_evento estado_zona_evento_evento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estado_zona_evento
    ADD CONSTRAINT estado_zona_evento_evento_id_fkey FOREIGN KEY (evento_id) REFERENCES public.eventos(id) ON DELETE CASCADE;


--
-- Name: eventos eventos_campamento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventos
    ADD CONSTRAINT eventos_campamento_id_fkey FOREIGN KEY (campamento_id) REFERENCES public.campamentos(id);


--
-- Name: eventos eventos_personal_registro_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventos
    ADD CONSTRAINT eventos_personal_registro_id_fkey FOREIGN KEY (personal_registro_id) REFERENCES public.personal(id);


--
-- Name: eventos eventos_tortuga_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.eventos
    ADD CONSTRAINT eventos_tortuga_id_fkey FOREIGN KEY (tortuga_id) REFERENCES public.tortugas(id) ON DELETE SET NULL;


--
-- Name: exhumaciones exhumaciones_nido_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exhumaciones
    ADD CONSTRAINT exhumaciones_nido_id_fkey FOREIGN KEY (nido_id) REFERENCES public.nidos(id) ON DELETE CASCADE;


--
-- Name: nidos nidos_evento_anidacion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nidos
    ADD CONSTRAINT nidos_evento_anidacion_id_fkey FOREIGN KEY (evento_anidacion_id) REFERENCES public.eventos(id) ON DELETE CASCADE;


--
-- Name: observaciones_tortuga observaciones_tortuga_evento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observaciones_tortuga
    ADD CONSTRAINT observaciones_tortuga_evento_id_fkey FOREIGN KEY (evento_id) REFERENCES public.eventos(id) ON DELETE CASCADE;


--
-- Name: tortugas tortugas_especie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tortugas
    ADD CONSTRAINT tortugas_especie_id_fkey FOREIGN KEY (especie_id) REFERENCES public.especies(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict oKQnfUzV7pE7x3kS8N3jW2kTfFEbDOHi7zztzYqhOmfXwfSROYN90cpJeV9UJZQ

