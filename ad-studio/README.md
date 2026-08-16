# Ad studio

Shared Remotion workspace for every remotion-ads campaign.

Product repos keep marketing intelligence. This folder keeps the camera.

```sh
npm install
npm run studio
npm run render -- smoke-test renders/smoke-test/smoke-test.mp4
```

Or from anywhere after install:

```sh
ad --studio
ad --render smoke-test
```

New campaigns are created by `ad --scaffold` / the skill, then registered with `scripts/generate-registry.sh`.
