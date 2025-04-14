export const amplifyConfig = {
  API: {
    GraphQL: {
      endpoint: 'https://h4fahjozybgi3jrdidobca7u3m.appsync-api.us-east-1.amazonaws.com/graphql',
      region: 'us-east-1',
      defaultAuthMode: 'apiKey' as any, // 👈 typecast it
      apiKey: 'da2-p6wqhyitwbcwhigwz3bm3shvim',
    },
  },
};
