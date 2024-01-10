# Dungeon Adventure Gang Modding API Documentation {{versionLabel}}

We highly recommend you read the docs before starting your development journey

## Example Main Class for new Mods

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
