# Celq GitHub Action

Run celq commands in your GitHub Actions workflows.

## Usage

```yaml
- name: Example Celq Action
  id: exampleID
  uses: get-celq/celq@main
  with:
    cmd: celq 'this.exampleID' < example.json

- name: Reuse a variable obtained in another step
  run: echo ${{ steps.exampleID.outputs.result }}
```

## Inputs

### `cmd` (required)

The command to run. This can be any shell command that includes celq, such as:
- `celq 'this.field' < input.json`
- `curl https://api.example.com/data | celq 'this.items.filter(x, x.has("otherfield"))'`
- `cat data.json | celq '.users[0].name'`

### `version` (optional)

The version of celq to use. Defaults to `latest`.

You can specify:
- A specific version: `0.1.1`
- A version with v prefix: `v0.1.1`
- Latest version: `latest` (default)

## Outputs

### `result`

The output from the celq command, which can be used in subsequent steps.

## Examples

### Basic usage

```yaml
- name: Parse JSON file
  id: responseStatus
  uses: get-celq/celq@main
  with:
    cmd: celq 'this.status' < response.json

- name: Use the result
  run: echo "Status is ${{ steps.responseStatus.outputs.result }}"
```

### With specific version

```yaml
- name: Run celq with specific version
  id: query
  uses: get-celq/celq@main
  with:
    cmd: celq -n -b 'this.status' < response.json
    version: 0.1.2
```

We also handle the `v` prefix:

```yaml
- name: Run celq with specific version
  id: query
  uses: get-celq/celq@main
  with:
    cmd: celq 'this.data.items' < response.json
    version: v0.1.2
```

### With piped input

```yaml
- name: Fetch and parse data
  id: fetch
  uses: get-celq/celq@main
  with:
    cmd: echo '[1, 2, 3]' | celq 'this[1]'

- name: Display result
  run: echo "Username: ${{ steps.fetch.outputs.result }}"
```

This will output: `2`.

## License

MIT