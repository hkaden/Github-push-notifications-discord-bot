export const commands = [
    {
      name: "add",
      description: "綁定一個Webhook到本頻道",
      options: [
        {
          name: "channel",
          description: "Channel ID",
          type: 3,
          required: false,
        },
      ],
    },
    {
      name: "remove",
      description: "刪除一個Webhook綁定",
      options: [
        {
          name: "uuid",
          description: "Webhook UUID",
          type: 3,
          required: true,
        },
      ],
    },
  ];