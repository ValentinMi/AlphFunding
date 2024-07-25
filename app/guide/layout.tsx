"use client";
import { Layout } from "../components/layout/Layout";
import "github-markdown-css";
import { Box } from "@chakra-ui/react";

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  // Create any shared layout or styles here
  return (
    <Layout>
      <Box h={"100%"} className={"markdown-body"}>
        {children}
      </Box>
    </Layout>
  );
}
