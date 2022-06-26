import * as pageModel from './models/pages.js'
import * as profileModel from './models/profiles.js'
import Async from 'crocks/Async/index.js'

import compose from 'ramda/src/compose'
import pluck from 'ramda/src/pluck'
import reverse from 'ramda/src/reverse'
import sortBy from 'ramda/src/sortBy'
import prop from 'ramda/src/prop'
import map from 'ramda/src/map'
import path from 'ramda/src/path'
import head from 'ramda/src/head'
import isEmpty from 'ramda/src/isEmpty'
import identity from 'ramda/src/identity'

export function profiles({ gql, post, load }) {
  const deployProfile = post ? Async.fromPromise(post) : () => Async.of(null)

  async function get(addr) {
    return Async.of(addr)
      .map(buildProfileQry)
      .chain(Async.fromPromise(gql))
      .map(pluckNodes)
      .chain(nodes => isEmpty(nodes) ? Async.Rejected(null) : Async.Resolved(nodes))
      .map(formatProfiles)
      .map(head)
      .chain(({ id }) => Async.fromPromise(load))
      .toPromise().catch(identity)

  }

  async function create(profile) {
    return Async.of(profile)
      .chain(profileModel.validate)
      .map(profile => ({ profile, tags: profileModel.createTags(profile) }))
      .chain(({ profile, tags }) => deployProfile(profile, tags).map(({ id }) => ({ ...profile, id })))
      .toPromise()
  }

  return {
    get,
    create,
    load
  }
}

export function pages({ register, post, gql, postWebpage, load }) {
  const deployPage = post ? Async.fromPromise(post) : () => Async.of(null)
  const registerPage = register ? Async.fromPromise(register) : () => Async.of(null)


  //const void = () => null

  async function create(page, notify) {
    return Async.of(page)
      .chain(pageModel.validate)
      .chain(page =>
        Async.of(page).map(({ title, description, html }) => ({
          title,
          html: htmlTemplate(title, description, html)
        })).chain(Async.fromPromise(postWebpage))
          .map(({ id }) => ({ ...page, webpage: id }))
      )
      .map(_ => (notify({ step: 1, message: 'generating page' }), _))
      .chain(page => deployPage(page).map(({ id }) => ({ ...page, id })))
      .map(_ => (notify({ step: 2, message: 'deploying page' }), _))
      .toPromise()
  }

  async function purchase({ name, owner, transactionId }) {
    return registerPage({ name, owner, transactionId }).toPromise()
  }

  async function list(account) {
    return Async.of(account)
      .map(buildPermaPageQuery)
      .chain(Async.fromPromise(gql))
      .map(pluckNodes)
      .map(formatPages)
      .toPromise()
  }

  async function publish(page) {
    return Async.of(page)
      .map(({ title, description, html }) => ({
        title,
        html: htmlTemplate(title, description, html)
      }))
      .chain(Async.fromPromise(postWebpage))
      .toPromise()
  }

  async function get(id) {
    return Async.of(id)
      .chain(Async.fromPromise(load))
      .toPromise()
  }

  async function history() {
    return Async.of()
      .map(buildDeployHx)
      .chain(Async.fromPromise(gql))
      .map(pluckNodes)
      .toPromise()
  }

  return {
    purchase,
    create,
    list,
    get,
    history
  }
}

function buildProfileQry(addr) {
  return `
query {
  transactions(
    owners: ["${addr}"],
    tags: [
      { name: "Protocol", values: ["PermaProfile-v0.1"]}
    ]
  ) {
    edges {
      node {
        id
        owner {
          address
        },
        tags {
          name
          value
        }
      }
    }
  }
}  
  `
}

function buildDeployHx() {
  return `
query {
  transactions(tags: [
    {name:"DEPLOY", values:["permapages"]},
    {name:"Content-Type", values:["application/x.arweave-manifest+json"]}
  ]) {
    edges {
      node {
        id
      }
    }
  }
}
  `
}

function formatPages(nodes) {
  return compose(
    reverse,
    sortBy(prop("timestamp")),
    map(pageModel.txToPage)
  )(nodes)
}

function formatProfiles(nodes) {
  return compose(
    reverse,
    sortBy(prop("timestamp")),
    map(profileModel.txToProfile)
  )(nodes)
}


function pluckNodes(results) {
  return compose(
    pluck('node'),
    path(['data', 'data', 'transactions', 'edges'])
  )(results)
}

function htmlTemplate(title, description, body) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${description}">
    <meta name="about" content="Webpage generated by https://permanotes.app">
    <link href="https://cdn.jsdelivr.net/npm/daisyui@2.15.4/dist/full.css" rel="stylesheet" type="text/css" />
    <script src="https://cdn.tailwindcss.com/3.1.3?plugins=typography"></script> 
    <script src="https://unpkg.com/arweave@1.11.4/bundles/web.bundle.min.js"></script>
  </head>
  <body>
    <main class="bg-base-100">
    ${body}
    </main>
  </body>
</html>  
`
}


function buildPermaPageQuery(owner) {
  return `
  query {
    transactions(owners: ["${owner}"], 
      tags:{name:"Protocol", values:["PermaPages-v0.3"]}) {
      edges {
        node {
          id
          owner{
            address
          }
          tags {
            name 
            value 
          }
          data {
            size
          }
          block {
            id
          }
        }
      }
    }
  }
  `
}