
import * as apiscript from 'apiscript';
import * as transform from '../util/text-transformers';
import * as propertyWriter from "./property-writer";

import {API} from "apiscript";
import {TypescriptWriter} from "./typescript-writer";

export function writeRequestClasses(api: API, libDir: string, mainWriter: TypescriptWriter) {

    api.forEachEndpoint((endpoint, index) => {
        let url = transform.urlToDash(endpoint.url);
        let fileName = `${url}-${apiscript.requestMethodToString(endpoint.requestMethod).toLowerCase()}`;

        mainWriter.writeLine(`import Request${index} from './request/${fileName}';`);

        let writer = new TypescriptWriter(`${libDir}/request/${fileName}.ts`);
        propertyWriter.writePropertyImports(writer, endpoint);
        writer.newLine();

        writer.write('export class Request ');
        writer.openClosure();

        writer.writeLine('public parameter = new Parameters();');

        if (endpoint.requestType) {
            writer.writeLine(`public body: ${propertyWriter.propertyTypeToString(endpoint.requestType)};`);
        }
        writer.closeClosure();
        writer.newLine();

        writer.write('export class Parameters ');
        writer.openClosure();

        endpoint.forEachProperty((property) => {
            propertyWriter.writeProperty(writer, property);
        });

        writer.closeClosure();
        writer.newLine();

        writer.close();
    });

}