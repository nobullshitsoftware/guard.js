# Guard.js: Lock Down Sensitive Modules

> This is a proof of concept, and a work in progress

Lock down all sensitive operations behind a special token that is passed around
only to trusted code.

Example:


```js
// Fail
console.log(process.cwd());

// OK
guard.withPerm(guard.token, {process: {cwd: true}}, () => {
  console.log(process.cwd());
});
```

## The Problem Guard.js Solves

Problem: any 3rd party library you include (or they, or their dependencies, or
their dependencies' dependencies, or ...) has immediate full access to your
entire system. This leads to:

* https://www.theregister.co.uk/2018/07/12/npm_eslint/
* https://medium.com/@jsoverson/how-two-malicious-npm-packages-targeted-sabotaged-one-other-fed7199099c8
* https://github.com/dominictarr/event-stream/issues/116
* ...

Malicious packages which steal credentials or other private data, and which have
an outsized effect due to the incredibly top-heavy node.js dependency trees.

## Work in Progress

We're evaluating whether this approach is even feasible, at all. Maybe it's
impossible. Time will tell.

## Authors and License

The authors are listed in the AUTHORS file, the license is kept in the LICENSE
file.
