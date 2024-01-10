# Dungeon Adventure Gang Modding API Documentation {{versionLabel}}

Wir empfehlen das lesen der Dokumentation bevor du auf dein entwicklungs Abenteuer aufbrichst.
## Beispiel Main Class für neue Mods

```csharp
using Dungeon_Adventure_Gang.Modding;

namespace Example_Mod
{
	public class Example_Mod : Mod
	{
		public override string modName => "Example Mod";

		public override string Version => "v.1.0";

		public override void Loading()
		{
			Logger.info("Loaded");
		}

		public override void Unloading()
		{
			Logger.info("Unloaded");
		}

		public override void Update()
		{
			Logger.info("Updated");
		}
	}
}
```
