# nestolog

Logger for NestJS, implements `LoggerService`. Based on [ololog](https://github.com/xpl/ololog)

<a target="_blank" href="https://raw.githubusercontent.com/unlight/nestolog/master/screenshots/a-1673.png"><img src="https://raw.githubusercontent.com/unlight/nestolog/master/screenshots/a-0830.png"></img></a>

## Install

```sh
npm install --save-dev nestolog

```

## Usage

```ts
import { Logger } from '@nestjs/common';
import { NestologModule } from 'nestolog';

@Module({
    imports: [NestologModule.forRoot(options)],
})
export class AppModule {}
```

## Use as the main Nest Logger

```ts
const app = await NestFactory.create(AppModule);
app.useLogger(app.get(NestoLogger));
```

It's not recommended to use this logger in production, since it's relative slow.

## Options

[Ololog configuration](https://github.com/xpl/ololog#configuration) and plus custom configuration:

```ts
/**
 * Format date using https://github.com/lukeed/tinydate
 */
timeFormat: undefined as undefined | string,
/**
 * Limit of context message.
 */
contextLimit: 13,
/**
 * Word wrap width for message.
 * If 0 (default) tries to auto detect.
 * If -1 disable
 */
messageColumnWidth: 0,
/**
 * Alternative locate. Default ololog's locate add callee info to the last non-empty string
 * Custom locate add callee info on next new line.
 */
customLocate: undefined as undefined | boolean | typeof customLocateDefault,
/**
 * Place of callee info.
 * 'bottom' - next on new line (default)
 * 'column' - between tag and message columnized
 * 'context' - in context column if context is empty
 */
customLocatePosition: 'bottom' as 'bottom' | 'column' | 'context',
/**
 * Limit callee info length in case of customLocatePosition = 'column'
 */
customLocateColumnLimit: 30,
```

## Development

-   ololog pipeline: stringify trim lines concat indent tag time locate join render returnValue

## Resources

### Context Candidates

-   https://github.com/nestjs-steroids/async-context
-   https://github.com/yort-feng/http-context-nodejs
-   https://github.com/abonifacio/nestjs-request-context
-   https://github.com/medibloc/nestjs-request-context

## Todo
