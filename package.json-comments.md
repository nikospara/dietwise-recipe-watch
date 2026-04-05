# Comments about the package.json

Since JSON does not allow comments and since `package.json` is central for any JS project and the
heart of its configuration, let's keep here any comments, decisions, design notes etc.


## Held back

Document any packages that are deliberately held back.

Format is:

> ### package-name - pinned version - newest version
>
> Reasoning...


### ~~jsdom - 24.x - 27.x~~

ChatGPT claims there is an issue/conflict because Ionic / Stencil components do not yet support JSDOM 27+. I could not find any actual reference, but no better solution either, so holding this package back for the time being.

**Resolution (2026/02/18):** ChatGRP offered a solution with shims in `setupTests.ts` that works around the problem.


### react-router/react-router-dom - 5.x - 7.x

Incompatible with ionic-router.


### eslint: 9.x - 10.x

At least `eslint-plugin-react`, `eslint-plugin-react-hooks` have a peer dependency on `eslint@"^... || ^9"`.


### typescript: 5.x - 6.x

Because `typescript-eslint` does not support it.
