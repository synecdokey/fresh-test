/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import {compile, run} from 'mdx'

type Article = {
  text: string;
}

export const handler: Handlers<Article | null> = {
async GET(_, ctx) {

  const {name} = ctx.params;
  try {
    const path =
    Deno.cwd() === "/src"
      ? `${Deno.cwd()}/www/articles/`
      : `${Deno.cwd()}/articles/`;
  const filePath = path + name + ".mdx";
    const article = await Deno.readFile(filePath);
    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(article)
    const out = await compile(text, {outputFormat: 'function-body', pragmaImportSource: 'preact', jsxRuntime: 'classic', pragma: 'h', useDynamicImport: true});
    return ctx.render({out})
  } catch (e) {
    return ctx.render(null)
  }
}
}

export default async function Greet(props: PageProps) {
  const C = props.data.out
  console.log(C)
  const D = await run(C);
  console.log(D.default())
  return <div><img /></div>;
}
