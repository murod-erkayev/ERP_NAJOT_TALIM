// src/hooks/useGeneral.ts

import { useNavigate } from "react-router-dom";
import type { PaginationConfig } from "../types/general";

const useGeneral = () => {
  const navigate = useNavigate();

  const handlePagination = ({ pagination, setParams }: PaginationConfig) => {
    const { current, pageSize } = pagination;

    setParams({
      page: current!,
      limit: pageSize!,
    });

    const searchParams = new URLSearchParams();
    searchParams.set("page", String(current));
    searchParams.set("limit", String(pageSize));

    navigate({
      search: `?${searchParams.toString()}`,
    });
  };

  return {
    handlePagination,
  };
};

export default useGeneral;
