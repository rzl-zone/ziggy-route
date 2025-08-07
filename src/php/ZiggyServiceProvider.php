<?php

namespace RzlZone\ZiggyRoute;

use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use Laravel\Octane\Events\RequestReceived;
use Illuminate\View\Compilers\BladeCompiler;
use RzlZone\ZiggyRoute\Helpers\RzlZiggyHelper;

class ZiggyServiceProvider extends ServiceProvider
{
  public function register()
  {
    $this->loadHelpers();
  }

  public function boot()
  {
    if ($this->app->resolved("blade.compiler")) {
      $this->registerDirective($this->app["blade.compiler"]);
    } else {
      $this->app->afterResolving("blade.compiler", function (BladeCompiler $bladeCompiler) {
        $this->registerDirective($bladeCompiler);
      });
    }

    /** @disregard P1009 NO-CHECK => RequestReceived::class */
    Event::listen(RequestReceived::class, function () {
      BladeRouteGenerator::$generated = false;
    });

    RzlZiggyHelper::applyDefaultUrl();

    if ($this->app->runningInConsole()) {
      $this->commands(CommandRouteGenerator::class);

      $this->publishes([
        __DIR__ . "/config/rzl-ziggy.php" => config_path("rzl-ziggy.php"),
      ], "rzl-ziggy");
    }
  }

  protected function registerDirective(BladeCompiler $blade): void
  {
    $blade->directive("rzlRoutes", fn($group) => "<?php echo app('" . BladeRouteGenerator::class . "')->generate({$group}); ?>");
  }

  protected function loadHelpers()
  {
    foreach (glob(__DIR__ . "/Helpers/*.php") as $filename) {
      require_once $filename;
    }
  }
}
