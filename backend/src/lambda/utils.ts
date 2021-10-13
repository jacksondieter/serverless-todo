import { APIGatewayProxyEvent } from "aws-lambda";
import { parseUserId } from "../auth/utils";

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}

export const Responses = {
  _DefineResponse(statusCode = 502, data = {}) {
      return {
          headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Methods': '*',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true
          },
          statusCode,
          body: JSON.stringify(data),
      };
  },

  _200(data = {}) {
      return this._DefineResponse(200, data);
  },
  _201(data = {}) {
    return this._DefineResponse(201, data);
  },

  _400(data = {}) {
      return this._DefineResponse(400, data);
  },
  _404(data = {}) {
      return this._DefineResponse(404, data);
  },
};