export interface Location {
    file: string;
    line?: number;
    column?: number;
}

export interface Entry extends Location {
    beforeParse: string;
    callee: string;
    index: boolean;
    native: boolean;

    calleeShort: string;
    fileRelative: string;
    fileShort: string;
    fileName: string;
    thirdParty: boolean;

    hide?: boolean;
    sourceLine?: string;
    sourceFile?: SourceFile;
    error?: Error;
}

export interface SourceFile {
    path: string;
    text: string;
    lines: string[];
    error?: Error;
}
