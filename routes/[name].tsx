/** @jsx h */
import { h } from "preact";
import * as runtime from 'preact/jsx-runtime'
import { Handlers, PageProps } from "$fresh/server.ts";
import {compile, runSync } from 'mdx'

type Article = {
  text: string;
}

export const handler: Handlers<Article | null> = {
async GET(_, ctx) {

  const {name} = ctx.params;
  console.log(name)
  try {
    const path = `${Deno.cwd()}/articles/`;
    console.log(Deno.cwd())
  const filePath = path + name + ".mdx";
    const article = await Deno.readFile(filePath);
    console.log('read file')
    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(article)
    console.log('decoded file')
    const out = await compile(text, {outputFormat: 'function-body' })
    console.error(out)
    return ctx.render({out: String(out)})
  } catch (e) {
    console.error(e)
    return ctx.render(null)
  }
}
}

export default function Greet(props: PageProps) {
  const {default: Component} = runSync(props.data.out, runtime);
  return <div><Component /></div>;
}
