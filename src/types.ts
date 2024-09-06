export type RowImageData = {
  id: string;
  type: number;
  content: string;
  channel_id: string;
  author: {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    public_flags: number;
    premium_type: number;
    flags: number;
    bot: boolean;
    banner: string | null;
    accent_color: string | null;
    global_name: string | null;
    avatar_decoration_data: string | null;
    banner_color: string | null;
  };
  attachments: {
    id: string;
    filename: string;
    size: number;
    url: string;
    proxy_url: string;
    width: number;
    height: number;
    content_type: string;
    content_scan_version: number;
    placeholder: string;
    placeholder_version: number;
  }[];
  embeds: unknown;
  mentions: unknown;
  mention_roles: string[];
  pinned: boolean;
  mention_everyone: boolean;
  tts: boolean;
  timestamp: Date;
  edited_timestamp: string | null;
  flags: number;
  components: {
    type: number;
    components: {
      type: number;
      custom_id: string;
      style: number;
      label: string;
      emoji: unknown;
    }[];
  }[];

  message_reference: unknown;
  resolved: unknown;
  referenced_message: any;
};

// export type SingleImageData = {
//   massageID: string;
//   url: string;
//   prompt: string;
//   height: number;
//   width: number;
//   size: number;
//   channelID: string;
//   build_At: Date;
// };

export type SingleImageData = {
  url: string;
  prompt: string;
  createdAt: Date;
  isSingle: boolean;
  messageID: string;
  channelID: string;
};
