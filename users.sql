-------------------------------------------
create database crm;

create extension pgcrypto;

create table users (
	userid int generated always as identity,
	username character varying(30) not null unique,
	fullname character varying(100) not null,
	email character varying(100) not null check (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
	password character varying(256) not null,
	bio text,
	active boolean default false,
	usercreatedat timestamp default current_timestamp
);

create table images (
	imageid int generated always as identity,
	link character varying(100) not null,
	userid int not null,
	size character varying(100) not null,
	mimetype character varying(100) not null
)


insert into users (username, fullname, email, password, active) values
('ali', 'ali zairov', 'ali@gmail.com', crypt('1234', gen_salt('bf')), true),
('halil', 'hail zairov', 'halil@gmail.com', crypt('1234', gen_salt('bf')), false),
('nosir', 'nosir zairov', 'nosir@gmail.com', crypt('1234', gen_salt('bf')), true);