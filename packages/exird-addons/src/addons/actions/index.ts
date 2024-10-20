import { register } from "../../registry"
import { addons } from "./addons"
import setupDatabase from "./setup-database"
import { setupExird } from "./setup-exird"
import { setupExpress } from "./setup-express"

register(setupExird)
register(setupExpress)
register(addons)
register(setupDatabase)

export { setupExird, setupExpress, addons }
