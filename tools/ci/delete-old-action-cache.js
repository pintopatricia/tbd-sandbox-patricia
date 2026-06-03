/* eslint-disable no-console, no-await-in-loop, no-restricted-syntax */

const deleteOldActionCache = async (github, currentCacheKey) => {
  const caches = await github.paginate(
    github.rest.actions.getActionsCacheList,
    {
      owner: "Flutter-Global",
      repo: "tbd",
      per_page: 100,
    },
    (response) => response.data,
  );

  console.log(`Found ${caches.length} cache entries`);

  const masterCacheKeys = caches.filter((cache) => cache.ref === "refs/heads/master").map((cache) => cache.key);
  masterCacheKeys.push(currentCacheKey);

  console.log(`Master cache entries for ${masterCacheKeys.join()}`);

  const outdatedCaches = caches.filter(
    (cache) => cache.ref !== "refs/heads/master" && masterCacheKeys.includes(cache.key),
  );

  for (const cache of outdatedCaches) {
    await github.rest.actions.deleteActionsCacheById({
      owner: "Flutter-Global",
      repo: "tbd",
      cache_id: cache.id,
    });

    console.log(`Cache ${cache.key} for branch ${cache.ref} deleted.`);
  }
};

module.exports = deleteOldActionCache;
