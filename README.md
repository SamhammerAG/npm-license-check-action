# license-check-npm
This action checks licenses of npm packages.

## Inputs
see action definition [action.yaml](action.yaml)

## Example usage

```yaml
uses: SamhammerAG/npm-license-check-action@v1
with:
  packageDir: 'sources/app'
  allowedLicenses: 'MIT;Apache-2.0'
```
