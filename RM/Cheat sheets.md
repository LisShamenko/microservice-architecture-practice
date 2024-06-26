# Cheat sheets

## NestJS

```
                      ╭ 7 ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╮ 
      HTTP Response   ╎ Exception Filters ┌ 6 ───────────┐               ┌─────────────┐ ╎ 
    ← ────────────────┼───────────────────┤              ├ ← ────────────┤ Controller  │ ╎ 
                      ╎                   │ Interceptors │               │ ┌ 5 ──────┐ │ ╎ 
      ┌ 1 ─────────┐  ╎      ┌ 2 ─────┐   │              │   ┌ 4 ────┐   │ │ Actions │ │ ╎ 
    → ┤ Middleware ├──┼─── → ┤ Guards ├ → ┤              ├ → ┤ Pipes ├ → ┤ └─────────┘ │ ╎ 
      └────────────┘  ╎      └────────┘   └ 3 ───────────┘   └───────┘   └─────────────┘ ╎ 
      HTTP Request    ╰╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╯ 
```

## Redux

```
                       JSX
                        ↑
      ╭─── file 3 ──────│──────────────╮
      │ ╭─── file 2 ────│────────────╮ │
      │ │ ╭─── file 1 ──┴──────────╮ │ │
      │ │ │ Presentation Component ├────────────┬──────────────────────────────────╮
      │ │ ╰────────────────────────╯ │ │        │                                  │
      │ │ Container Component        │ │        │                                  │
      │ ╰────────────────────────────╯ │        │                                  │
      │ Container Component            │        │                                  │
      ╰──│─────────────────────────────╯        │                                  │
         │                                      │                                  │
  ╭──────╯                                      │                                  │
  │                                             │                                  │
╭─┴─ file 3 ────────────────────────────────────↓───┬─── file 3 ───────────────────↓───╮
│ connect(mapStateToProps, mapDispatchToProps)(...) │ compose(HOC, connect(s, d))(...) │
╰──────────│────────────────│───────────────────────┴──────────────────────────────────╯
           │                │
  ╭────────╯                ╰───────────────╮
  │                                         │
╭─┴─ file 3 ──────────────────╮           ╭─┴─ file 3 ──────────────────┬───────────────────╮
│ (state) => ({               │           │ {                           │ {                 │
│     props: selectors(state) │   ╭──────────── thunkDispatchFunction,  │     thunkCreator, │
│ })          │               │   │   ╭──────── actionDispatchFunction  │     actionCreator │
╰─────────────│───────────────╯   │   │   │ }                           │ }                 │
              │                   │   │   ╰─────────────────────────────┴───────────────────╯
  ╭───────────╯               ╭───╯   │ 
  │                           │       │
╭─┴─ file 4 ─────────────╮    │     ╭─┴─ file 3 ───────────────────────────────────╮
│ (state) => state.props │    │     │ (dispatch) => ({                             │
╰────────────────────────╯    │     │     callbacks: () => dispatch(actionCreator) ─────── → ┐
                              │     │ })                             │             │         │                                                   
                              │     ╰────────────────────────────────│─────────────╯         │                                                   
                              │                                      │                       │                                     
                              │           ╭──────────────────────────╯                       │                                     
                              │           │                                                  │          
                              │         ╭─┴─ file 5 ───────────────────────────────╮         │                                                   
                              │         │ (data) => ({ type: CONSTANTS, ...data }) │         │                                                   
                              │         ╰─────────────────────│────────────────────╯         │                                                   
                              │                             ╭─┴─ file 6 ──╮                  │                                          
                              │                             │ 'CONSTANTS' │                  │                                          
                              │                             ╰─────────────╯                  │                                          
                              │                                                              │                           
                            ╭─┴─ file 7 ─────────────────────────────────────────────────╮   │                                                         
                            │ (data) => (dispatch) => {                                  │   │                                                         
                            │     actionCreator(data);                                   │   │                                                         
            ╭──────────────────── return serverAPI.fetch().then(                         │   │                                                         
            │               │         (result) => dispatch(actionCreator(data, result)), ─ → ┤
          ╭─┴─ file 8 ──╮   │         (error) => dispatch(actionCreator(error))          ─ → ┤
          │  serverAPI  │   │     )                                                      │   │
          ╰─────────────╯   │ }                                                          │   │
                            ╰────────────────────────────────────────────────────────────╯   │
                                                                                             │  
                                              ┌──────────────────────────────────────────────┘
                                              │
                   ╭─────╮                    │                                old state
                   │     │                    │                               └────╥────┘          
                   │   ╭─┴─ file 9 ───────────↓────────────────────────────────────║─────╮       
                   │   │ (state = [], action) => ({                              ┌─╨─┐   │       
                   │   │     (action.type === 'CONSTANTS') ? [...state, {...}] : state;  │       
                   │   │ })                     │            └───────╥───────┘           │       
                   │   ╰────────────────────────│────────────────────║───────────────────╯       
                   │                          ╭─┴─ file 6 ──╮   ┌────╨────┐    
                   │                          │ 'CONSTANTS' │    new state                
                   │                          ╰─────────────╯                  
                   │                                     
                   ╰─────────────────────────────────────╮
╭────────╮                                               │
│ render │                                               │
╰──│─────╯                      ╭─── file 10 ────────────│───────────╮
   │                  ╭────────── createStore(           │           │
 ╭─┴─ file 10 ────────↓─────╮   │     combineReducers({ reducers }), │
 │ <Provider store={store}> │   │     initialState,                  │
 │     <App />              │   │     applyMiddleware(middleware)    │
 │ </Provider>              │   │ )                    │             │
 ╰──────────────────────────╯   ╰──────────────────────│─────────────╯
                                                       │
                                  ╭────────────────────╯
                                  │
                                ╭─┴─ file 11 ────────────────────────╮
                                │ (store) => (next) => (action) => { │
                                │     store.getState();              │
                                │     next(action);                  │
                                │     store.getState();              │
                                │ }                                  │
                                ╰────────────────────────────────────╯
```

## RabbitMQ

```
amqp://username:password@localhost:5672/virtualhost/exchange?routingKey=value
 \_/   \_______________/ \_______/ \__/ \_________/ \_____________/ \_______/
  |           |              |       |       |            |             |                
  |           |      broker hostname |       |            |         Specifies routing key value (optional)
  |           |                      |       |            |
  |           |                      |  virtual host (optional)
  |           |                      |                    | 
  |           |                      |                    |
  |           |       node port, if absent 5672 is used   |
  |           |                                           |
  |  rabbit mq user info, if absent guest:guest is used   |
  |                                                       |   
schema name                                         exchange name used for dispatching messages (optional)
```
