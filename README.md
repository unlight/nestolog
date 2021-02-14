# nestolog

Logger for NestJS, implements `LoggerService`. Based on [ololog](https://github.com/xpl/ololog)

## Install

```sh
npm install --save-dev nestolog

```

## Usage

```ts
import { Logger } from '@nestjs/common';

@Module({
    imports: [NestologModule.forRoot(options)],
})
export class AppModule {}
```

## Options

[Ololog configuration](https://github.com/xpl/ololog#configuration) and plus custom configuration:

```ts
/**
 * Limit context to this number of chars.
 */
contextLimit: 13,
/**
 * Word wrap width for message.
 * If 0 (default) tries to auto detect.
 * If -1 disable
 */
messageColumnWidth: 0,
```

## Use as the main Nest Logger

```ts
const app = await NestFactory.create(AppModule);
app.useLogger(app.get(NestoLogger));
```

It's not recommended to use logger in production, since it's relative slow.

## Resources

### Context Candidates

-   https://github.com/nestjs-steroids/async-context
-   https://github.com/yort-feng/http-context-nodejs
-   https://github.com/abonifacio/nestjs-request-context
-   https://github.com/medibloc/nestjs-request-context
