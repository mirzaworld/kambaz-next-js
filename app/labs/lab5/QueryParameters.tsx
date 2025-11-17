"use client";
import React, { useState } from "react";
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
export default function QueryParameters() {
  const [ a, setA ] = useState( "34" );
  const [ b, setB ] = useState( "23" );
  return (
    <div id="wd-query-parameters">
      <h3>Query Parameters</h3>
      <input id="wd-query-parameter-a" defaultValue={ a } type="number" onChange={ ( e ) => setA( e.target.value ) } />
      <input id="wd-query-parameter-b" defaultValue={ b } type="number" onChange={ ( e ) => setB( e.target.value ) } />
      <div className="mt-2">
        <a id="wd-query-parameter-add" className="btn btn-primary me-2" href={`${ HTTP_SERVER }/lab5/calculator?operation=add&a=${ a }&b=${ b }`}>Add { a } + { b }</a>
        <a id="wd-query-parameter-subtract" className="btn btn-danger" href={`${ HTTP_SERVER }/lab5/calculator?operation=subtract&a=${ a }&b=${ b }`}>Subtract { a } - { b }</a>
        <a id="wd-query-parameter-multiply" className="btn btn-success ms-2" href={`${ HTTP_SERVER }/lab5/calculator?operation=multiply&a=${ a }&b=${ b }`}>Multiply { a } * { b }</a>
        <a id="wd-query-parameter-divide" className="btn btn-warning ms-2" href={`${ HTTP_SERVER }/lab5/calculator?operation=divide&a=${ a }&b=${ b }`}>Divide { a } / { b }</a>
      </div>
      <hr />
    </div>
  );
}
