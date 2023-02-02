# license-check-npm
This action checks licenses of npm packages.

## Inputs

**path** Directory with package.json to check. Default `.`.

**licenseWhitelist** List of allowed licenses. Example `MIT;Apache-2.0`. Required!


## Example usage

```yaml
uses: SamhammerAG/npm-license-check-action@v1
with:
  path: 'sources/app'
  licenseWhitelist: 'MIT,Apache-2.0'
```
