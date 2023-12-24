package com.example.project1

import jupiterpi.cranberri.runtime.api.*

@Script
class MyScript {
    @Setup
    fun setup() {
        IO.log("started!")

        Arduino.pinMode(1, OUTPUT)
        Arduino.pinMode(2, INPUT)

        IO.log(MY_CONSTANT)
        mySharedMethod()
        
        IO.disableDebug()
    }

    @Tick
    fun tick() {
        IO.writePin(1, IO.readPin(2))
    }
}