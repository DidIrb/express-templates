import { register } from "../../registry"
import { addons } from "./addons"
import { setupExird } from "./setup-exird"
import { setupExpress } from "./setup-express"

register(setupExird)
register(setupExpress)
register(addons)

export { setupExird, setupExpress, addons }
