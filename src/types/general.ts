// src/types/general.ts

import type { TablePaginationConfig } from "antd";
import type { ReactNode } from "react";

export interface ProtectType {
  children: ReactNode;
}

export interface PaginationConfig {
  pagination: TablePaginationConfig;
  setParams: (params: ParamsType) => void;
}

export interface ParamsType {
  page: number;
  limit: number;
}
