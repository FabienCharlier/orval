import {
  GeneratorClient,
  GeneratorDependency,
  GeneratorOptions,
  GeneratorVerbOptions,
} from '../../types/generator';
import { pascal } from '../../utils/case';
import { sanitize, toObjectString } from '../../utils/string';
import { generateVerbImports } from './imports';
import { generateMutatorConfig, generateOptions } from './options';

const AXIOS_DEPENDENCIES: GeneratorDependency[] = [
  {
    exports: [
      { name: 'axios', default: true, values: true },
      { name: 'AxiosRequestConfig' },
    ],
    dependency: 'axios',
  },
];

export const getAxiosDependencies = () => AXIOS_DEPENDENCIES;

const generateAxiosImplementation = (
  {
    queryParams,
    operationName,
    response,
    mutator,
    body,
    props,
    verb,
  }: GeneratorVerbOptions,
  { route }: GeneratorOptions,
) => {
  if (mutator) {
    const mutatorConfig = generateMutatorConfig({
      route,
      body,
      queryParams,
      response,
      verb,
    });

    return `const ${operationName} = <Data = unknown>(\n    ${toObjectString(
      props,
      'implementation',
    )}\n options?: SecondParameter<typeof ${mutator.name}>) => {
      return ${mutator.name}<Data extends unknown ? ${
      response.definition
    } : Data>(
      ${mutatorConfig},
      // eslint-disable-next-line
      // @ts-ignore
      options);
    }
  `;
  }

  const options = generateOptions({
    route,
    body,
    queryParams,
    response,
    verb,
  });

  return `const ${operationName} = <Data = unknown>(\n    ${toObjectString(
    props,
    'implementation',
  )} options?: AxiosRequestConfig\n  ) => {${body.formData}
    return axios.${verb}<Data extends unknown ? ${
    response.definition
  } : Data>(${options});
  }
`;
};

export const generateAxiosTitle = (title: string) => {
  const sanTitle = sanitize(title);
  return `get${pascal(sanTitle)}`;
};

export const generateAxiosHeader = ({
  title,
  hasMutator,
  noFunction,
}: {
  title: string;
  hasMutator: boolean;
  noFunction?: boolean;
}) => `${
  hasMutator
    ? `type SecondParameter<T extends (...args: any) => any> = T extends (
  config: any,
  args: infer P,
) => any
  ? P
  : never;\n\n`
    : ''
}
  ${!noFunction ? `export const ${title} = () => {\n` : ''}`;

export const generateAxiosFooter = (operationIds: string[] = []) =>
  `return {${operationIds.join(',')}}};\n`;

export const generateAxios = (
  verbOptions: GeneratorVerbOptions,
  options: GeneratorOptions,
): GeneratorClient => {
  const imports = generateVerbImports(verbOptions);
  const implementation = generateAxiosImplementation(verbOptions, options);

  return { implementation, imports };
};
