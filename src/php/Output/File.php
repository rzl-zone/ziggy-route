<?php

namespace RzlZone\ZiggyRoute\Output;

use Stringable;
use RzlZone\ZiggyRoute\RzlZiggy;
use RzlZone\ZiggyRoute\Helpers\RzlZiggyHelper;

class File implements Stringable
{
  public function __construct(protected RzlZiggy|string $ziggy, private $ext)
  {
    if (config("rzl-ziggy.output.encrypting", false)) {
      $this->ziggy = RzlZiggyHelper::encryptCryptPayload(json_encode($ziggy, JSON_UNESCAPED_SLASHES));
    } else {
      $this->ziggy = json_encode($ziggy, JSON_UNESCAPED_SLASHES);
    }
  }

  public function __toString(): string
  {
    $banner = RzlZiggyHelper::generateComposerBanner("ts-files");

    if ($this->ext === "ts") {
      return <<<JAVASCRIPT
        {$banner}
        export const appRoutes: string = `$this->ziggy`;
        JAVASCRIPT;
    }

    $banner = RzlZiggyHelper::generateComposerBanner("js-files");
    return <<<JAVASCRIPT
    {$banner}
    export const appRoutes = `$this->ziggy`;
    JAVASCRIPT;
  }

  /** @deprecated Use `toString()` instead. */
  public function _toString_(): string
  {
    return <<<JAVASCRIPT
    const appRoutes = {$this->ziggy->toJson(JSON_UNESCAPED_SLASHES)};

    if (typeof window !== "undefined" && typeof window.appRoutes !== "undefined") {
      Object.assign(appRoutes.routes, window.appRoutes.routes);
    }

    export { appRoutes };
    JAVASCRIPT;
  }
}
