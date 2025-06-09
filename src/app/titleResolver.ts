import { ResolveFn } from "@angular/router";

export const titleResolver: ResolveFn<string> = (route) => {
return route.queryParams['title'] || 'Default Title'
}