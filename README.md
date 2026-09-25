# habit-grid

Printable monthly habit-grid generator — pick a month, pick habits,
print the grid, tick boxes on paper. Single-file offline HTML, zero
npm dependencies.

```text
$ npm test          # 6 core tests (Node)
$ npm run build     # -> dist/index.html
```

## Features

- **Month selection** — correct day counts including leap years
  (Feb 2024 = 29, Feb 1900 = 28); Monday-first columns with weekend
  highlighting.
- **Custom habits** — four defaults plus your own, remembered in
  localStorage.
- **Print-friendly** — light grid with real borders; the print button
  uses the browser dialog for PDF or paper.
- **Markdown export** — `toMarkdown` renders the same grid as a
  markdown table.

## Development

```console
$ npm test
$ npm run build
```

## License

MIT — see [LICENSE](LICENSE).
