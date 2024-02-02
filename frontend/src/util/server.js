import { SERVER_ADDRESS, SERVER_PORT } from "../config/config";

export function getBackendURL() {
  return `${SERVER_ADDRESS}:${SERVER_PORT}`;
}
