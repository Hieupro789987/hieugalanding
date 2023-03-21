import axios from "axios";
import getConfig from "next/config";
import { CrudRepository, QueryInput } from "../repo/crud.repo";
import { request } from "graphql-request";

const { publicRuntimeConfig } = getConfig();
const domain = publicRuntimeConfig.domain;

export class RequestGraphql<T> {
  _url = `${domain}/graphql`;
  _service: CrudRepository<T>;
  _apiName: string;
  _fragment: string;
  _variables: QueryInput;
  _headers: HeadersInit;

  constructor(
    service: CrudRepository<T>,
    apiName: string,
    fragment?: string,
    variables?: QueryInput,
    headers?: HeadersInit
  ) {
    this._service = service;
    this._apiName = apiName;
    this._fragment = fragment || "";
    this._variables = variables || {};
    this._headers = headers || {};
  }

  get query() {
    const query = `
    query($q: QueryGetListInput) {
      ${this._apiName}(q: $q) {
      data {
          ${this._fragment || this._service.shortFragment}
        }
      }
    }`;

    return query;
  }

  //getAll
  async request(): Promise<T[]> {
    const response = await request({
      url: this._url,
      document: this.query,
      variables: {
        q: {
          limit: 99999,
          ...this._variables,
        },
      },
      requestHeaders: {
        ...this._headers,
      },
    });
    return response[`${this._apiName}`].data;
  }

  async findOne(): Promise<T | undefined> {
    const data = await this.request();
    if (!data) return;
    return data[0];
  }
}
