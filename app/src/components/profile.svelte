<script>
  import isEmpty from "ramda/src/isEmpty";
  export let profile;
  //export let icon_repo = "https://social-icons.arweave.dev";
  export let icon_repo =
    "https://arweave.net/T2Kh2uOv3myw8L6BPE6kySs2QXjh8R3B1KolcW_MFQA";
</script>

<div class="h-[475px] w-full">
  <div
    style="background-image: url({profile.background || '/background.svg'})"
    class="bg-cover bg-no-repeat w-full h-[300px] mb-[50px]"
  >
    <div class="w-full h-full flex flex-col justify-between relative">
      <ul class="w-full flex flex-row-reverse p-5">
        {#if profile.links}
          {#if profile.links.facebook}
            <li>
              <a
                href="https://facebook.com/{profile.links.facebook}"
                target="_blank"
                rel="noreferrer"
              >
                <button
                  style="
            background-image: url({icon_repo}/facebook-icon.png);
          "
                  class="w-[64px] h-[64px] m-5 rounded-xl bg-cover bg-no-repeat"
                />
              </a>
            </li>
          {/if}
          {#if profile.links.linkedin}
            <li>
              <a
                href="https://www.linkedin.com/in/{profile.links.linkedin}"
                target="_blank"
                rel="noreferrer"
              >
                <button
                  style="
            background-image: url({icon_repo}/linkedin-icon.png);
          "
                  class="w-[64px] h-[64px] m-5 rounded-xl bg-cover bg-no-repeat"
                />
              </a>
            </li>
          {/if}
          {#if profile.links.github}
            <li>
              <a
                href="https://github.com/{profile.links.github}"
                target="_blank"
                rel="noreferrer"
              >
                <button
                  style="
            background-image: url({icon_repo}/github-icon.png);
          "
                  class="w-[64px] h-[64px] m-5 rounded-xl bg-cover bg-no-repeat"
                />
              </a>
            </li>
          {/if}
          {#if profile.links.discord}
            <li>
              <a
                href="https://discord.com/users/{profile.links.discord}"
                target="_blank"
                rel="noreferrer"
              >
                <button
                  style="
            background-image: url({icon_repo}/discord-icon.png);
          "
                  class="w-[64px] h-[64px] m-5 rounded-xl bg-cover bg-no-repeat"
                />
              </a>
            </li>
          {/if}
          {#if profile.links.twitch}
            <li>
              <a
                href="https://twitch.com/{profile.links.twitch}"
                target="_blank"
                rel="noreferrer"
              >
                <button
                  style="
            background-image: url({icon_repo}/twitch-icon.png);
          "
                  class="w-[64px] h-[64px] m-5 rounded-xl bg-cover bg-no-repeat"
                />
              </a>
            </li>
          {/if}
          {#if !isEmpty(profile.links.instagram)}
            <li>
              <a
                href="https://instagram.com/{profile.links.instagram}"
                target="_blank"
                rel="noreferrer"
              >
                <button
                  style="
            background-image: url({icon_repo}/instagram-icon.png);
          "
                  class="w-[64px] h-[64px] m-5 rounded-xl bg-cover bg-no-repeat"
                />
              </a>
            </li>
          {/if}
          {#if profile.links.youtube}
            <li>
              <a
                href="https://youtube.com/c/{profile.links.youtube}"
                target="_blank"
                rel="noreferrer"
              >
                <button
                  style="
            background-image: url({icon_repo}/youtube-icon.png);
          "
                  class="w-[64px] h-[64px] m-5 rounded-xl bg-cover bg-no-repeat"
                />
              </a>
            </li>
          {/if}
          {#if profile.links.twitter}
            <li>
              <a
                href="https://twitter.com/{profile.links.twitter}"
                target="_blank"
                rel="noreferrer"
              >
                <button
                  style="
            background-image: url({icon_repo}/twitter-icon.png);
          "
                  class="w-[64px] h-[64px] m-5 rounded-xl bg-cover bg-no-repeat"
                />
              </a>
            </li>
          {/if}
        {/if}
      </ul>
      <div class="w-full flex m-5 absolute top-[200px] left-0">
        <img
          alt="avatar"
          src={profile.avatar || "/avatar.svg"}
          class="ml-5 mr-5 shadow-xl rounded-full border-4 h-[250px] w-[250px] bg-base-300"
        />
        <div class="flex flex-col justify-center">
          <p class="m-1 text-3xl tracking-tight text-base-600">
            {profile.name}
          </p>
          {#if profile.bio}
            <p class="m-1 text-xl text-base-600">{profile.bio}</p>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
