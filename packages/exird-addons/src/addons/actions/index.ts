import { register } from "../../registry"
import { setupExird } from "./setup-exird"
import { setupExpress } from "./setup-express"

register(setupExird)
register(setupExpress)

export { setupExird, setupExpress }
