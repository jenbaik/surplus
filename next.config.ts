import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    // /demoday is invite-only: belt-and-braces noindex alongside the page's
    // robots metadata, plus its API.
    return [
      {
        source: "/(demoday|api/rsvp)",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/apply",
        destination: "https://airtable.com/appaxqJfxht7OronH/pag3FYwDukcF9syiu/form",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
