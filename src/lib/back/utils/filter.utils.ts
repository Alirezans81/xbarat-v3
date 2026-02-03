import { Prisma } from "@/generated/prisma";

type FilterType = "string" | "number" | "boolean" | "date" | "enum";

type FilterOption = {
  type: FilterType;
  enumValues?: readonly string[];
  transform?: (value: string) => unknown;
  prismaField?: string;
};

export type FilterOptions = Record<string, FilterOption>;

export class FilterBuilder {
  static buildWhereInput<T>(
    searchParams: URLSearchParams,
    filterOptions: FilterOptions
  ): Prisma.Args<T, "findMany">["where"] {
    const where: Record<string, unknown> = {};

    for (const [param, config] of Object.entries(filterOptions)) {
      if (searchParams.has(param)) {
        const value = searchParams.get(param);
        const field = config.prismaField || param;

        if (value !== null) {
          where[field] = this.transformValue(value, config);
        }
      }
    }

    return where as Prisma.Args<T, "findMany">["where"];
  }

  private static transformValue(value: string, config: FilterOptions[string]) {
    switch (config.type) {
      case "number":
        return Number(value);
      case "boolean":
        return value === "true";
      case "date":
        return new Date(value);
      case "enum":
        if (config.enumValues?.includes(value)) {
          return value;
        }
        return undefined;
      default:
        return config.transform ? config.transform(value) : value;
    }
  }

  static buildPagination(searchParams: URLSearchParams) {
    const limit = searchParams.has("limit")
      ? Math.min(Number(searchParams.get("limit")), 100)
      : 20;
    const offset = searchParams.has("offset")
      ? Number(searchParams.get("offset"))
      : 0;

    return { limit, offset };
  }

  static buildOrderBy(searchParams: URLSearchParams, defaultSort: string) {
    const sort = searchParams.get("sort") || defaultSort;
    const [field, direction] = sort.split(":");

    return {
      [field]: direction === "asc" ? "asc" : "desc",
    };
  }
}
