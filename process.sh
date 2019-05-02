#!/bin/sh
cd model
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
java -Xmx4096m -Xss1024K -Duser.timezone=UTC -Dname=51677 -Djava.library.path="lib" -cp "lib\WRIMSv2.jar;lib\commons-io-2.1.jar;lib\XAOptimizer.jar;lib\lpsolve55j.jar;lib\coinor.jar;lib\gurobi.jar;lib\heclib.jar;lib\jnios.jar;lib\jpy.jar;lib\misc.jar;lib\pd.jar;lib\vista.jar;lib\guava-11.0.2.jar;lib\javatuples-1.2.jar;lib\kryo-2.24.0.jar;lib\minlog-1.2.jar;lib\objenesis-1.2.jar;lib\jarh5obj.jar;lib\jarhdf-2.10.0.jar;lib\jarhdf5-2.10.0.jar;lib\jarhdfobj.jar;lib\slf4j-api-1.7.5.jar;lib\slf4j-nop-1.7.5.jar" wrimsv2.components.ControllerBatch -config=$parent_path/workspace/__study.config
cd ..