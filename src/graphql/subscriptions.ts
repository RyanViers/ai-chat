/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateConversation = /* GraphQL */ `subscription OnCreateConversation(
  $filter: ModelSubscriptionConversationFilterInput
  $owner: String
) {
  onCreateConversation(filter: $filter, owner: $owner) {
    id
    owner
    aiModel
    title
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateConversationSubscriptionVariables,
  APITypes.OnCreateConversationSubscription
>;
export const onUpdateConversation = /* GraphQL */ `subscription OnUpdateConversation(
  $filter: ModelSubscriptionConversationFilterInput
  $owner: String
) {
  onUpdateConversation(filter: $filter, owner: $owner) {
    id
    owner
    aiModel
    title
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateConversationSubscriptionVariables,
  APITypes.OnUpdateConversationSubscription
>;
export const onDeleteConversation = /* GraphQL */ `subscription OnDeleteConversation(
  $filter: ModelSubscriptionConversationFilterInput
  $owner: String
) {
  onDeleteConversation(filter: $filter, owner: $owner) {
    id
    owner
    aiModel
    title
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteConversationSubscriptionVariables,
  APITypes.OnDeleteConversationSubscription
>;
export const onCreateMessage = /* GraphQL */ `subscription OnCreateMessage(
  $filter: ModelSubscriptionMessageFilterInput
  $owner: String
) {
  onCreateMessage(filter: $filter, owner: $owner) {
    id
    conversationId
    text
    sender
    timestamp
    status
    owner
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateMessageSubscriptionVariables,
  APITypes.OnCreateMessageSubscription
>;
export const onUpdateMessage = /* GraphQL */ `subscription OnUpdateMessage(
  $filter: ModelSubscriptionMessageFilterInput
  $owner: String
) {
  onUpdateMessage(filter: $filter, owner: $owner) {
    id
    conversationId
    text
    sender
    timestamp
    status
    owner
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateMessageSubscriptionVariables,
  APITypes.OnUpdateMessageSubscription
>;
export const onDeleteMessage = /* GraphQL */ `subscription OnDeleteMessage(
  $filter: ModelSubscriptionMessageFilterInput
  $owner: String
) {
  onDeleteMessage(filter: $filter, owner: $owner) {
    id
    conversationId
    text
    sender
    timestamp
    status
    owner
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteMessageSubscriptionVariables,
  APITypes.OnDeleteMessageSubscription
>;
