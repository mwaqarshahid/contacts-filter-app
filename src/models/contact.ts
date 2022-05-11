export type Contact = {
  id:               string;
  accountId:        string;
  type:             string;
  name:             string;
  phoneNumber:      string;
  platformNames:    any[];
  messagesSent:     number;
  messagesReceived: number;
  createdAt:        string;
  img:              null;
  assignee:         null;
  tags:             Tag[];
}

export type Tag = {
  name: string;
}