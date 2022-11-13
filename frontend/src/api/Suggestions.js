/* eslint-disable import/prefer-default-export */

export const getSuggestionsList = async ({ deviceID }) => [
  {
    id: 1,
    title: 'There are only 20% of clothes remaining to wear for Profile 1 user.',
    priority: 1,
    deviceID,
  },
  {
    id: 2,
    title: 'Hey Profile2, Here are the 5 clothes we suggest for your next client xyz meeting.',
    priority: 0,
    deviceID,
  },
  {
    id: 3,
    title:
      'Hey Profile3, The weather is going to get windy soon make sure to check this 4 items in your list to wear.',
    priority: 2,
    deviceID,
  },
];
