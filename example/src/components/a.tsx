import React from 'react'
import ReactMarkdown from './page'

export default function React__Markdown() {
  return (
        <ReactMarkdown>
          <div className="markdown-body">
          <React.Fragment>
            {/* notes test */}
<p>[[toc]]</p>
<h1>hello react-markdown</h1>
<p>use vite</p>
<h2>code</h2>
<pre><code className="language-js">const a = 100
<div>111</div>
</code></pre>

          </React.Fragment>
        </div>
        </ReactMarkdown>
  )
}
export const attributes = { title: '我的博客', description: null, date: '2022-07-02T09:30:21.000Z' }
