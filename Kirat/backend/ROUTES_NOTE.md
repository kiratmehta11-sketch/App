# Fix the task routes to have correct endpoints

# Currently the route /tasks/project/:projectId conflicts with /tasks/:taskId
# Need to ensure order is correct in routes

# The routes should be checked in this order:
# 1. /tasks/project/:projectId (more specific)
# 2. /tasks/:taskId (less specific)

# This is already handled correctly in the routing since Express checks in order
