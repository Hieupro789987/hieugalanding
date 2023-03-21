import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { ApolloQueryResult, FetchResult, MutationOptions, QueryOptions } from "@apollo/client/core";
import { initializeApollo } from "../graphql/apollo-client";
import gql from "graphql-tag";

export class GraphRepository {
  static instance = null;
  static getInstance() {
    if (GraphRepository.instance == null) {
      GraphRepository.instance = new GraphRepository();
    }

    return GraphRepository.instance;
  }

  private _apollo: ApolloClient<NormalizedCacheObject>;
  get apollo() {
    if (!this._apollo) {
      this._apollo = initializeApollo();
    }
    return this._apollo;
  }

  gql: Function = gql;

  query({
    query,
    options,
    variablesParams,
    token,
    roleId,
  }: {
    query: string[] | string;
    options?: Partial<QueryOptions>;
    variablesParams?: string;
    token?: string;
    roleId?: string;
  }) {
    return this.apollo.query<any>({
      query: gql`
        ${this.generateGQL("query", query, variablesParams, options?.variables)}
      `,
      variables: options?.variables,
      fetchPolicy: options?.fetchPolicy,
      context: {
        token,
        roleId,
      },
    });
  }

  subscribe({
    query,
    options,
    variablesParams,
    token,
    roleId,
  }: {
    query: string[] | string;
    options?: Partial<QueryOptions>;
    variablesParams?: string;
    token?: string;
    roleId?: string;
  }) {
    return this.apollo.subscribe<any>({
      query: gql`
        ${this.generateGQL("subscription", query, variablesParams, options?.variables)}
      `,
      variables: options?.variables,
      fetchPolicy: options?.fetchPolicy,
      context: {
        token,
        roleId,
      },
    });
  }

  watchQuery({
    query,
    options,
    variablesParams,
    token,
    roleId,
  }: {
    query: string[] | string;
    options?: Partial<QueryOptions>;
    variablesParams?: string;
    token?: string;
    roleId?: string;
  }) {
    return this.apollo.watchQuery<any>({
      query: gql`
        ${this.generateGQL("query", query, variablesParams, options?.variables)}
      `,
      variables: options?.variables,
      fetchPolicy: options?.fetchPolicy,
      context: {
        token,
        roleId,
      },
    });
  }

  async mutate({
    mutation,
    options,
    variablesParams,
    clearStore,
    token,
    roleId,
  }: {
    mutation: string[] | string;
    options?: Partial<MutationOptions>;
    variablesParams?: string;
    clearStore?: boolean;
    token?: string;
    roleId?: string;
  }) {
    let result = await this.apollo.mutate<any>({
      mutation: gql`
        ${this.generateGQL("mutation", mutation, variablesParams, options?.variables)}
      `,
      variables: options?.variables,
      fetchPolicy: options?.fetchPolicy,
      context: {
        ...options?.context,
        token,
        roleId,
      },
    });

    let clearStoreFlag = false;
    if (clearStore !== undefined) {
      clearStoreFlag = clearStore;
    } else {
      let mutationList = [];
      if (typeof mutation == "string") {
        mutationList.push(mutation.trim());
      } else {
        mutationList = mutation.map((x) => x.trim());
      }
      for (const m of mutationList) {
        if (m.indexOf("create") == 0 || m.indexOf("delete") == 0 || m.indexOf("update") == 0) {
          clearStoreFlag = true;
          break;
        }
      }
    }
    if (clearStoreFlag) {
      await this.clearStore();
    }

    return result;
  }

  generateGQL(
    type: "query" | "mutation" | "subscription",
    list: string[] | string,
    variableParams = null,
    variables = null
  ) {
    let logGql: string[];
    let gql = `${type}${variableParams || ""} {
        `;
    if (typeof list == "string") {
      gql += `g0: ${list}
        `;
      logGql = [list];
    } else {
      for (let i = 0; i < list.length; i++) {
        gql += `\ng${i}: ${list[i]}`;
      }
      logGql = list;
    }
    gql += `
      }`;
    gql = gql.replace(/\s{2,}/g, " ");
    if (type == "mutation") {
      console.log(
        `${type}: ${logGql
          .map((item) => item.slice(0, item.indexOf(variableParams ? "(" : "{")).trim())
          .join(", ")}`,
        variables ? { gql, variables } : { gql }
      );
    }
    return gql;
  }

  async clearStore() {
    await this.apollo.clearStore();
  }

  handleError(result: ApolloQueryResult<any> | FetchResult) {
    if ((result as ApolloQueryResult<any>).error) {
      throw Error((result as ApolloQueryResult<any>).error.message);
    }
    if (result.errors && result.errors.length > 0) {
      throw Error(result.errors[0].message);
    }
  }

  parseFragment(fragment) {
    const fragments = [];
    const lines = fragment.trim().split("\n");
    for (const line of lines) {
      const parts = line.split(":");
      const key = parts[0];
      fragments.push(key);
    }
    return fragments.join(" ").trim();
  }
}

export const GraphService = new GraphRepository();
