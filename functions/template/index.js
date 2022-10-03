import functions from '@google-cloud/functions-framework';
import m3o from 'm3o';
import { handler } from './handler';

global.m3o = m3o(process.env.NODE_ENV);

functions.http('main', handler);
