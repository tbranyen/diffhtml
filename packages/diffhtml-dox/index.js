const https = require('https');
const express = require('express');
const Git = require('nodegit');
const { join } = require('path');
const dox = require('dox');

const parseArgs = str => {
  const arg = /export\s+\{(.*)\}/g.exec(str)[1];

  if (arg.indexOf(',') > -1) {
    return arg.split(',').map(str => str.trim()).filter(Boolean)[0];
  }
  else if (arg.indexOf('as') > -1) {
    return arg.split(' as ')[1].trim();
  }

  return arg.trim();
};

dox.contextPatternMatchers.push((string, parentContext) => {
  // Handle ES6 export syntax.
  if (string.indexOf('export') > -1) {
    const name = parseArgs(string);

    if (name) {
      return {
        type: 'property',
        name,
        string,
      };
    }
  }
});

const get = url => new Promise((resolve, reject) => {
  https.get(url, (err, resp) => {
    if (err) { reject(err); }
    else { resolve(resp); }
  });
});

const url = 'https://github.com/tbranyen/diffhtml';
const output = process.env.REPO || join(__dirname, './.repo');

const cloneRepository = state => {
  console.log('Attempting to clone a fresh copy');

  return Git.Clone(state.url, state.output).then(repo => {
    state.repo = repo;
    return state;
  }).catch(ex => {
    console.log(`The repository ${state.output} aready exists`);
    throw state;
  });
};

const openRepository = state => {
 console.log(`Attemping to open ${state.output}`);

  return Git.Repository.open(state.output).then(repo => {
    state.repo = repo;
    return state;
  });
};

const getReferenceNames = state => {
  console.log('Looking up all reference names (branches, tags, omit remotes)');

  const getAllReferences = Promise.all([
    // Get all references from GitHub.
    get('https://api.github.com/repos/tbranyen/diffhtml/git/refs')
      .then(resps => resps.map(resp => resp.ref)).catch(() => {}),

    // Get all references from the local repository.
    state.repo.getReferenceNames(Git.Reference.TYPE.LISTALL),
  ]);

  return getAllReferences.then(([_, refs]) => {
    state.refs = refs.reduce((m, c) => m.concat(c), []);
    state.refs.reverse();
    const result = state.refs.splice(state.refs.length - 1, 1)[0];
    state.refs.unshift(result);
    return state;
  });
};

const getLatestStable = state => {
  const tags = state.refs.filter(ref => ref.includes('refs/tags'));
  const latest = tags.sort()[tags.length - 1];

  state.latestStable = latest.slice('refs/tags/'.length);
  state.version = state.latestStable;

  return state.repo.getReferenceCommit('refs/tags/0.9.1')
    .then(commit => {
      return commit.getEntry('lib/index.js').catch(() => {
        return commit.getEntry('packages/diffhtml/lib/index.js');
      });
    })
    .then(treeEntry => treeEntry.getBlob())
    .then(blob => {
      const contents = String(blob);
      const comments = dox.parseComments(contents);

      state.comments = comments;

      return state;
    });
};

const getByReference = ref => state => {
  state.version = ref.split('/')[2];

  return state.repo.getReferenceCommit(ref)
    .then(commit => {
      return commit.getEntry('lib/index.js').catch(() => {
        return commit.getEntry('packages/diffhtml/lib/index.js');
      });
    })
    .then(treeEntry => treeEntry.getBlob())
    .then(blob => {
      const contents = String(blob);
      const comments = dox.parseComments(contents);

      state.ref = ref;
      state.comments = comments;

      return state;
    });
};

//////////////////////////////////////

console.log('Booting up API middleware');

const router = express.Router();
const state = { url, output };
const getRepository = cloneRepository(state)
  .catch(openRepository)
  .then(getReferenceNames);

const getApiState = exports.getApiState = version => {
  if (version) {
    return getRepository
      .then(getLatestStable)
      .then(getByReference(version));
  }

  return getRepository.then(getLatestStable);
};

router.get('/', (req, res, next) => {
  console.log(req.url);
  getApiState().then(resp => res.json(resp));
});

router.get('/:version', (req, res, next) => {
  getApiState(req.params.version).then(resp => res.json(resp)).catch(console.log);
});

exports.router = router;
