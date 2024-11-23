export type LoginData = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  pid: string;
  name: string;
  is_verified: boolean;
};

export type PodcastPayload = {
  file: File;
  title: string;
};
