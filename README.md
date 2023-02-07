# npm-license-check-action
This action checks licenses of npm packages and fails if finding licenses that are not allowed.\
It also shows an overview of packages with license information.\
We are using [license-checker](https://github.com/RSeidelsohn/license-checker-rseidelsohn) to do the checks.

The action checks
- production dependencies (ignores dev dependencies)
- only direct dependencies (ignores subdependencies)
- public packages (ignores private)

## Inputs
see action definition [action.yaml](action.yaml)

## Example usage

```yaml
uses: SamhammerAG/npm-license-check-action@v1
with:
  packageDir: 'sources/app'
  exportDir: 'sources/app/public'
  allowedLicenses: 'MIT;Apache-2.0'
```

## Sample Outputs

Shows which package uses which licenses.
```
| Package                           | License Type |
|--------------------------------------------------|
| @actions/core@1.10.0              | MIT          |
| license-checker-rseidelsohn@3.3.0 | BSD-3-Clause |
| lodash@4.17.21                    | MIT          |
| minimist@1.2.7                    | MIT          |
| npm-license-check-action@1.0.0    | MIT          |
```

Shows which package uses license that is not allowed.
```
Package "@actions/core@1.10.0" is licensed under "MIT" which is not permitted by the --onlyAllow flag. Exiting.
```
