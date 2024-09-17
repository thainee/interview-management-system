import { candidateRoutes } from './candidateRoutes';
import { authRoutes } from './authRoutes';
import { offerRoutes } from './offerRoutes';
import { jobRoutes } from './jobRoutes';
import { scheduleRoutes } from './scheduleRoutes';
import {userRoutes} from "./userRoutes";
import { anotherRoutes } from './anotherRoutes';

export const routes = [
  ...authRoutes,
  ...candidateRoutes,
  ...offerRoutes,
  ...jobRoutes,
  ...scheduleRoutes,
  ...userRoutes,
  ...anotherRoutes
];